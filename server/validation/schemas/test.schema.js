module.exports = {
  properties :{
    referrer:{
      type: 'string'
    },
    host: {
      type:'string'
    },
    cart:{
     type:'string',
     minLength:24,
     maxLength:24
    },
    user:{
     type:'string',
     minLength:24,
     maxLength:24
    },
    video:{
     type:'string',
     minLength:24,
     maxLength:24
   },
   events: {
     type: "array",
     items: {
        type: "object",
        properties: {
          event : {
            type: "string",
            enum: ['VIEW_CHECKOUT','VIDEO_PLAY', 'VIDEO_ENDED','VIDEO_PROGRESS', 'ACTION_SHOW', 'ADD_TO_CART','UPDATE_FROM_CART','REMOVE_FROM_CART','ORDER_SAVED', 'LEADGEN_SAVED']
          },
          progress: {
            type: 'number'
          },
          action:{
            type: 'string'
          },
          product:{
            type: 'string'
          },
          order:{
            type: 'string'
          }
        },
        required:['event']
      }
    }
  },
  required:['host','user','video']
};
