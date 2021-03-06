'use strict'

const Project =use('App/Models/Project')
/**
 * Resourceful controller for interacting with projects
 */
class ProjectController {
  /*
   * Show a list of all projects.
   * GET projects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
      const {page}=request.get()
      const projects=await Project.query().with('user').paginate(page)
      return projects
  }
  async store ({ request, response,auth }) {

    const data = request.only(['title','description'])
    const project = await Project.create({ ...data,user_id:auth.user.id})

    return project
  }

  async show ({ params, request, response, view }) {

      const project = await Project.findOrFail(params.id)
      await project.load('user')
      await project.load('tasks')

      return project

  }


  /*
   * Update project details.
   * PUT or PATCH projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const project = await Project.findOrFail(params.id)
    const data = request.only(['title','description'])
    project.merge(data)

    await project.save()

    return project

  }


  async destroy ({ params, request, response }) {
    const project = await Project.findOrFail(params.id)

    await project.delete()
  }
}

module.exports = ProjectController
