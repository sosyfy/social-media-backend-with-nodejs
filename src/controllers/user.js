const User = require('#models/user')
const httpStatus = require('http-status')

/* READ */
exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
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
            user.connections.map((id) => User.findById(id))
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
       const currentUser = await User.findById(req.user.id)
       const users = await User.find({}).select('-password')
       // if we do not follow this user and if the user is not currentUser
       let suggestedUsers = users.filter((user) => {
        return (
            !currentUser.connections.includes(user._id) 
            && user._id.toString() !== currentUser._id.toString()
        )
       }) 

       if(suggestedUsers.length > 5){
        suggestedUsers = suggestedUsers.slice(0, 5)
       }

       return res.status(200).json(suggestedUsers)
    } catch (error) {
        return res.status(httpStatus['500_MESSAGE']).json(error.message)
    }
}

exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find({})
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json(error.message) 
    }
}
/* UPDATE */
exports.addRemoveConnection = async (req, res) => {
    try {
        const { id, connectionId } = req.params;

        if (id === connectionId) {
            throw new Error("You can't follow yourself")
        }

        const user = await User.findById(id);
        const connection = await User.findById(connectionId);

        if (user.friends.includes(connectionId)) {
            user.connections = user.connections.filter((id) => id !== connectionId);
            connection.connections = connection.connections.filter((id) => id !== id);

            await user.save();
            await connection.save();

            const connections = await Promise.all(
                user.connections.map((id) => User.findById(id))
            );
            const formattedConnections = connections.map(
                ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                    return { _id, firstName, lastName, occupation, location, picturePath };
                }
            );
            res.status(httpStatus.OK).json(formattedConnections);
        } else {
            user.connections.push(connectionId);
            connection.connections.push(id);

            await user.save();
            await connection.save();

            const connections = await Promise.all(
                user.connections.map((id) => User.findById(id))
            );
            const formattedConnections = connections.map(
                ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                    return { _id, firstName, lastName, occupation, location, picturePath };
                }
            );
            res.status(httpStatus.OK).json(formattedConnections);
        }
    } catch (err) {
        res.status(httpStatus['404_MESSAGE']).json({ message: err.message });
    }
};

exports.updateUser = async(req, res) => {
    if(req.params.userId.toString() === req.user.id.toString()){
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, {$set: req.body}, {new: true})
            return res.status(200).json(updatedUser)
            
        } catch (error) {
            return res.status(httpStatus.NOT_MODIFIED).json(error.message) 
        }
    } else {
        return res.status(httpStatus.FORBIDDEN).json({msg: "You can change only your own profile!"})
    }
}
