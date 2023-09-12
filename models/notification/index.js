const notificationSchema = require('./notificationSchema.js')
const BASEURL = process.env.BASEURL;
try {
  module.exports = {
    addNotification: async (data) => {
      try {
        const notification = new notificationSchema({
          title:data.title,
          description:data.description,
          userId: data.userId,
          image: BASEURL+"images/i/user_d.jpg",
        })
        await notification.save();
        return "notification send"
      } catch (err) {
        return err;
      }
    },
    deleteNotification: async (id,uid) => {
      try {
        const notification = await notificationSchema.findOne({_id:id});
        if(!notification){return new Error("no notification found")}
        if(notification.userId !== uid){return new Error("You can not delete other's notification")}
        await  notificationSchema.findOneAndDelete({_id:id,userId:uid},{new:true});
        return "deleted successfully"
      } catch (err) {
        return err;
      }
    },
    usersNotification: async (id) => {
      try {
        const notification = await notificationSchema.find({userId:id}).sort({createdAt:-1});
        return notification;
      } catch (err) {
        return err;
      }
    },
    
  };
} catch (e) {
  log.error(e);
}
