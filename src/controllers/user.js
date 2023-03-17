const User = require('#models/user')
const Auth = require('#models/auth')

const httpStatus = require('http-status')

/* READ */
exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate('userInfo');
        res.status(httpStatus.OK).json(user);
    } catch (err) {
        res.status(httpStatus.NOT_FOUND).json({ message: err.message });
    }
};

exports.getUserConnections = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const connections = await Promise.all(
            user.connections.map((id) => User.findById(id).populate('user'))
        );
        const formattedConnections = connections.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(httpStatus.OK).json(formattedConnections);
    } catch (err) {
        res.status(httpStatus.NOT_FOUND).json({ message: err.message });
    }
};

exports.getSuggestedConnections = async(req, res) => {
    try {
       const currentUser = await User.findById(req.user.id).populate('userInfo');
       const users = await User.find().populate('userInfo');
       // if we do not follow this user and if the user is not currentUser
       let suggestedUsers = users.filter((user) => {
        return (
            !currentUser.connections.some( some => some._id.toString() === user._id.toString()) 
        )
       }).filter( user => user.email != currentUser.email)
       if(suggestedUsers.length > 5){
        suggestedUsers = suggestedUsers.slice(0, 5)
       }
       
       return res.status(200).json(suggestedUsers)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } }).populate('userInfo').sort({ createdAt: -1 })
        
        if (users.length > 40) {
            users = users.slice(0, 40)
        }

        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json(error) 
    }
}
/* UPDATE */
exports.addRemoveConnection = async (req, res) => {
    try {
        const { userId, connectionId } = req.body;

        if (userId === connectionId) {
            throw new Error("You can't follow yourself")
        }

        const user = await User.findById(userId).populate('userInfo');
        const connection = await User.findById(connectionId).populate('userInfo');
      
        if (user.connections.some(con => con.email == connection.email)) {
            user.connections = user.connections.filter((con) => con._id.toString() !== connectionId);
            await user.save();
            res.status(httpStatus.OK).json(user);
        } else {
            user.connections.push(connection);
            await user.save();
        
            res.status(httpStatus.OK).json(user);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) => {
  
    if(req.params.userId.toString() === req.user.id.toString()){
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, {$set: req.body}, {new: false})
            return res.status(200).json(updatedUser)
            
        } catch (error) {
            return res.status(500).json(error) 
        }
    } else {
        return res.status(500).json({msg: "You can change only your own profile!"})
    }
}
