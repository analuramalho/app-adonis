'use strict'

const crypto =require('crypto')
const User=use('App/Models/User')

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

    }catch(err){
      return response.status(err.status).send({error:{message:'Algo não deu certo, esse e-mail existe?'}})
    }

  }
}

module.exports = ForgotPasswordController
