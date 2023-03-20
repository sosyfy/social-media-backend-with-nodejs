const User = require('#models/user')
const Auth = require('#models/auth')
const Post = require('#models/post')
const httpStatus = require('http-status');

/* READ */
exports.getUser = async (req, res) => {
    try {
        // find one user 
        const { id } = req.params;
        const user = await User.findById(id).populate('userInfo');

        // Find all connections associated with the user
        const connections = await Promise.all(
            user.connections.map((con) => User.findById(con._id).populate('userInfo'))
        );

        
        const posts = await Post.find({user: id }).populate("userInfo")

        let connectionNo = connections.length
        let postNo = posts.length

        
        res.status(httpStatus.OK).json({
            posts,
            postNo,
            connectionNo,
            connections,
            user
        });
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

exports.getSuggestedConnections = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id).populate('userInfo');
        const users = await User.find().populate('userInfo');

        // Get a list of all the IDs of users that the current user is connected with
        const connectedUserIds = currentUser.connections.map((connection) =>
            connection._id.toString()
        );

        // Filter out users that the current user is already connected with or is the current user
        let suggestedUsers = users.filter(
            (user) =>
                !connectedUserIds.includes(user._id.toString()) &&
                user.email !== currentUser.email
        );

        // Sort suggested users by the number of connections they have in common with the current user
        suggestedUsers.sort((a, b) => {
            const aConnections = a.connections.filter((connection) =>
                connectedUserIds.includes(connection._id.toString())
            );
            const bConnections = b.connections.filter((connection) =>
                connectedUserIds.includes(connection._id.toString())
            );
            return bConnections.length - aConnections.length;
        });

        // Limit the number of suggested users to 5
        suggestedUsers = suggestedUsers.slice(0, 5);

        return res.status(200).json(suggestedUsers);
    } catch (error) {
        return res.status(500).json(error.message);
    }

}

exports.getAllUsers = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id).populate('userInfo');
        const users = await User.find().populate('userInfo');

        // Get a list of all the IDs of users that the current user is connected with
        const connectedUserIds = currentUser.connections.map((connection) =>
            connection._id.toString()
        );

        // Filter out users that the current user is already connected with or is the current user
        let suggestedUsers = users.filter(
            (user) =>
                !connectedUserIds.includes(user._id.toString()) &&
                user.email !== currentUser.email
        );

        // Sort suggested users by the number of connections they have in common with the current user and with each other
        suggestedUsers.sort((a, b) => {
            const aCommonConnections = a.connections.filter((connection) =>
                connectedUserIds.includes(connection._id.toString())
            );
            const bCommonConnections = b.connections.filter((connection) =>
                connectedUserIds.includes(connection._id.toString())
            );
            const aSharedConnections = suggestedUsers
                .filter((user) => user._id.toString() !== a._id.toString())
                .reduce(
                    (commonConnections, user) =>
                        commonConnections.concat(
                            user.connections.filter(
                                (connection) =>
                                    connectedUserIds.includes(connection._id.toString()) &&
                                    connection._id.toString() === a._id.toString()
                            )
                        ),
                    []
                );
            const bSharedConnections = suggestedUsers
                .filter((user) => user._id.toString() !== b._id.toString())
                .reduce(
                    (commonConnections, user) =>
                        commonConnections.concat(
                            user.connections.filter(
                                (connection) =>
                                    connectedUserIds.includes(connection._id.toString()) &&
                                    connection._id.toString() === b._id.toString()
                            )
                        ),
                    []
                );

            return (
                bCommonConnections.length +
                bSharedConnections.length -
                aCommonConnections.length -
                aSharedConnections.length
            );
        });

        // Limit the number of suggested users to 5
        suggestedUsers = suggestedUsers.slice(0, 30);

        return res.status(200).json(suggestedUsers);
    } catch (error) {
        return res.status(500).json(error.message);
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
        } else {
            user.connections.push(connection);
            await user.save();
        }

        const userInfo = await User.findById({ _id: userId }).populate('userInfo');
        console.log(userInfo);

        res.status(httpStatus.OK).json(userInfo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) => {

    if (req.params.userId.toString() === req.user.id.toString()) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: false })
            return res.status(200).json(updatedUser)

        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(500).json({ msg: "You can change only your own profile!" })
    }
}
