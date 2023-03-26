import User from "../models/User.js";

/* READ */
export const getUser = async(req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        res.status(200).json(user);
    } catch (error){
        res.status(404).json({error: error.message});
    }
}

export const getUserFriends = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(({
            _id, firstName, lastName, occupation, location, picturePath
        }) => {
            return {_id, firstName, lastName, occupation, location, picturePath}
        });
        res.status(200).json(formattedFriends);
    } catch (error){
        res.status(404).json({error: error.message});
    }
}
/* UPDATE */
export const addRemoveFriend = async(req, res) => {
    try {
        const { id, friendId } = req.params;

        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        // Check whether user is friends with the friendId user
        if(user.friends.includes(friendId)) {
            // If they're friends, remove the friend's ID from the user's friends array & vice versa
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            // If they're NOT friends, add them as friends of each other.
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(({
            _id, firstName, lastName, occupation, location, picturePath
        }) => {
            return {_id, firstName, lastName, occupation, location, picturePath}
        });

        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(404).json({error: error.message});
    }
}