const { Post } = require('../models/post')

const get_new_post_form = (req, res) => {
    res.render('new_post')
}

const publish_new_post = async(req, res) => {
    // saving data to the database
    try {
        // add author to the req body
        req.body.author = req.user._id
        const post = new Post(req.body);
        result = await post.save()
        res.redirect('/');
    } catch (error) {
        console.log(error)
    }
};

const get_single_post = (req, res) => {
    const id = req.params.id;
    Post.findById(id)
        .populate('author')
        .then((result) => {
        res.render('post', { post: result })
    }).catch((error) => {
        console.log(error)
    })
};

const get_update_post_form = async (req, res) => {
    const id = req.params.id;

    const post = await Post.findById(id).populate('author');
    if (!post) {
        req.flash('error', 'Post not found');
        return res.redirect('/');
    }
    if(post.author._id.toString() !== req.user._id.toString()) {
        req.flash('error', 'You are not authorized to update this post');
        res.status(400).redirect('/')
    }

    Post.findById(id).then((result) => {
        res.render('update_post', { post: result})
    }).catch((error) => console.log(error))
};

const update_single_post = async (req, res) => {
    const id = req.params.id;

    const post = await Post.findById(id).populate('author');
    if (!post) {
        req.flash('error', 'Post not found');
        return res.redirect('/');
    }
    if(post.author._id.toString() !== req.user._id.toString()) {
        req.flash('error', 'You are not authorized to update this post');
        res.status(400).redirect('/')
    }

    Post.findByIdAndUpdate(id, req.body)
        .then((result) => {
            res.redirect('/');
        }).catch((error) => console.log(error));
};

const delete_single_post = async (req, res) => {
    const id = req.params.id;
    const post = await Post.findById(id).populate('author');

    if(post.author._id.toString() !== req.user._id.toString()) {
        req.flash('error', 'You are not authorized to delete this post');
        res.status(400).redirect('/')
    }

    Post.findByIdAndDelete(id)
        .then((result) => {
            res.json({
                status: true,
                massage: 'Post deleted successfully',
                redirect: '/'
            })
        }).catch((error) => {
            res.json({
                status: false,
                error: 'Somthing went wrong',
                full_error: error
            })
        });
};

module.exports = {
    get_new_post_form,
    publish_new_post,
    get_single_post,
    get_update_post_form,
    update_single_post,
    delete_single_post
}