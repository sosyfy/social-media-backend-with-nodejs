module.exports = {
    components: {
        securitySchemes:{
            jwt: {
                type: "apiKey",
                in: "header",
                name: "Authorization",
                description: "Enter Bearer Token",  
            }  
        },
        responses: {
            BadRequest:{
                description:'Bad Request: Some parameters may contain invalid values',
                content: {
                   "application/json" :{
                     schema:{
                       $ref: '#/components/schemas/Error'
                     },
                     example: { 'code': 'BadRequest', 'message': 'Something is required' }
                   }
                }
            }
        }
    }
}