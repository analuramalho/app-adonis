'use strict'


const crypto =require('crypto')
const moment = require('moment')
const User=use('App/Models/User')
const Mail=use('Mail')

class ForgotPasswordController {
  async store ({ request,response}){
    try{
      //busca o email da req
      const email = request.input('email')

      //busca o email no cadastro de usuario
      const user= await User.findByOrFail('email',email)

      //cria um token para o usuario
      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at=new Date()

      //salva o usuario
      await user.save()

      //envia email de recuperação
      await Mail.send(
        ['emails.forgot_password'],
        {email, token: user.token,link:`${request.input('redirect_url')}?token=${user.token}`},
        message=>{
          message
            .to(user.email)
            .from('analuizaramalho10@gmail.com','Ana Luiza')
            .subject('Recuperação de senha')
        }
      )

    }catch(err){
      return response.status(err.status).send({error:{message:'Algo não deu certo, esse e-mail existe?'}})
    }

  }




  async update ({ request,response }){
    try{
      const { token, password } = request.all()
      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment().subtract('2','days').isAfter(user.token_created_at)

      if(tokenExpired){
        return response.status(401).send({ error: { message:'Token de recuperação esta expirado'}})
      }

      user.token = null
      user.token_created_at=null
      user.password=password

      await user.save()

    }catch(err){
      return response.status(err.status).send({error:{message:'Algo não deu errado ao resetar sua senha'}})
    }

  }

}

module.exports = ForgotPasswordController




