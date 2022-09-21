const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const CampGround = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


router.get('', wrapAsync(async (req, res, next) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds });
}))


// CREATE
// The order of 'new' and ':id' is important
// if ':id' is at first, it will regard 'new' as id too.
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/new', validateCampground, wrapAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new CampGround(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new camground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))


// READ
router.get('/:id', wrapAsync(async (req, res, next) => {
    const campground = await CampGround.findById(req.params.id).populate('reviews');
    if (!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))


// UPDATE
router.get('/:id/edit', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id, req.body);
    if (!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id/edit', validateCampground, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))


// DELETE
router.delete('/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}))


module.exports = router;




