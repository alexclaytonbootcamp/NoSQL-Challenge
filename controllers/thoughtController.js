const { User, Thought } = require('../models');

module.exports = {
    //thought routes
    getThoughts(req, res) {
        Thought.find()
        .select('__v')
        .then(async (thoughts) => {
            const thoughtObject = {
                thoughts
            };
            return res.json(thoughtObject);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.param.thoughtId })
        .select('__v')
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought with that ID' })
                : res.json({
                    thought
                })
        )
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });        
    },
    //need to push the thought '_id' to the associated user
    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => res.json(thought))
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true } //not sure what this does...
        )
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'No thought with that ID' })
                : res.json(thought)
        )
        .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
        })
    },
    deletethought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought with that ID'})
                : User.deleteOne({ _id: { $in: user.thoughts } }) //this isn't correct...
        )
        .then(() => res.json({ message: 'Thought deleted'}))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought with that ID'})
                : res.json(thought)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought with that ID'})
                : res.json(thought)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
};