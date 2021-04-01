const { Router } = require('express')
const bcrypt = require('bcryptjs')//данный модуль позволяет хэшировать пароли
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')//данный модуль позволяет нам валидировать полученные с фронтенда данные
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Некорректный email').isEmail(),// проверяем email 
        check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })// указываем что минимальная длина пароля 6 символов
    ],// массив мидлвееров который будет делать валидацию
    async (req, res) => {
        try {
           
            const errors = validationResult(req)

            if (!errors.isEmpty()) {//если массив errors не пустой то отправляем ошибку на фронтенд
                return res.status(400).json(
                    {
                        errors: errors.array(),
                        message: 'Некорректные данные при регистрации'
                    })
            }

            const { email, password } = req.body

            //проверяем есть ли уже в базе данных email, если он есть то не регестрируем данного пользователя и выдаём ошибку
            const candidate = await User.findOne({ email })

            if (candidate) {
                return res.status(400).json({ message: 'Пользователь уже существует' })
            }

            const hashedPassword = await bcrypt.hash(password, 12) // хэшируем пароли
            const user = new User({ email, password: hashedPassword })// создаём нового пользователя
            await user.save() // сохраняем пользователя
            res.status(201).json({ message: 'Пользователь создан' })
        }
        catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),// метод isEmail позволяет проверять email 
        check('password', 'Введите пароль').exists()
    ],// массив мидлвееров который будет делать валидацию,
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {//если массив errors не пустой то отправляем ошибку на фронтенд
                return res.status(400).json(
                    {
                        errors: errors.array(),
                        message: 'Некорректные данные при входе в систему'
                    })
            }

            const {email,password} = req.body;

            const user = await User.findOne({ email })//ищем пользователя по email

            if(!user){
                return res.status(400).json({message: 'Пользователь не найден'})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch){
                
                return res.status(400).json({message: 'Неправильный логин или пароль'})
            }

            const token = jwt.sign(
                { userId: user.id },// 1 параметр это объект в который мы передаём все параметры которые будут зашифрованы в данном jwt токене
                config.get("jwtSecret"),// 2 параметром мы передаём секретный ключь (который придумаем)
                {expiresIn: '1h'}// 3 параметр это объект в котором мы передаём через сколько времени наши jwt токены окончат своё существование
            )//принимает в себя 3 параметра

            res.json({ token, userId: user.id })

        }
        catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })

module.exports = router