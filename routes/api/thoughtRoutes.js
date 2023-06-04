const router = require('express').Router();

const {
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction

} = require('../../controller/thoughtController');

router.route('/')
    .get(getThoughts);

router.route('/:id')
    .get(getSingleThought)
    .post(createThought)
    .put(updateThought)
    .delete(deleteThought);

router.route('/:id/reactions')
    .post(addReaction)
    .delete(deleteReaction);