const { User } = require('../models/user');
const { generatePasswordHash } = require('../utils/auth')
const { authenticate } = require('../utils/auth')
const { upload } = require('../middlewares/upload');

// define the upload type
const storage = upload.single('image')

const renderRegisterUser = (req, res) => {
    return res.render('register')
}

const renderLoginUser = (req, res) => {
    return res.render('login')
}
const registerUser = async (req, res) => {
    try {
        const body = req.body;

        if (!body.firstName || !body.lastName || !body.password) {
            // send an error message
            req.flash('error', 'Please supply valid details')

            return res.status(400).redirect('/auth/register')
        }
        body.password = generatePasswordHash(body.password);
        body.email = body.email.toLowerCase();

        const isExisting = await User.findOne({email: body.email})
        if (isExisting) {
            //  send an error message of email duplicate
            req.flash('error', 'That email is already in use')
            return res.status(400).redirect('/auth/register/')
        }

        await new User(body).save();

        // send a success message 
        req.flash('success', 'Registeration successful. Please sign in')

        return res.status(201).redirect('/auth/login');
    } catch (error) {
        // send an error message 
        req.flash('error', 'Somthing went wrong in the server')
        return res.status(500).redirect('/auth/register');
    }
}

const loginUser = async(req, res) => {
    try {
        const body = req.body;
        if (!body.email || !body.password) {
                // send an error message
                req.flash('error', 'Please supply valid details')
                return res.status(400).redirect('/auth/login')
            }
            // finding the user
            const user = await User.findOne({ email: body.email.toLowerCase() });

            // if user not found
            if (!user) {
                req.flash('error', 'Invalid email or password');
                return res.status(400).redirect('/auth/login');
            }
            
            // if user found
            // check password match
            const valid = authenticate(body.password, user.password);
            if (!valid) {
                req.flash('error', 'Invalid email or password');
                return res.status(400).redirect('/auth/login');
            }

            // if password match
            // create user session
            req.session.user = user

            // send a success message
            req.flash('success', 'Login successfull');
            res.status(200).redirect(`/auth/dashboard/${user._id}`)
    } catch (error) {
        // send an error message 
        req.flash('error', 'Somthing went wrong in the server')
        return res.status(500).redirect('/auth/login');
    }
    
}

const renderDashboard = async (req, res) => {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if(!user) {
        req.flash('error', 'User not found');
        return res.status(404).redirect('/');
    }
    
    return res.render('dashboard', { publicUser: user });
}

const logoutUser = (req, res) => {
    return req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};

const updateProfile = async(req, res) => {
    storage(req, res, async (error) => {
        if(error) {
            req.flash('error', error.message);
            return res.status(400).redirect('/auth/dashboard/' + req.user._id)
        }
        
        
        const body = req.body;

        if(req.file) {
            body.image = req.file.path
        }

    if(!body.firstName && !body.lastName && !body.email && !body.phone && !body.about && !body.twitter) {
        // sending an error message 
        req.flash('error', 'Update information required');
        return res.status(400).redirect(`/auth/dashboard/${req.user._id}`)
    }
    // updating the user
    if (body.email) {
        const duplicate = await User.findOne({ email: body.email.toLowerCase() });
        if (duplicate && duplicate._id.toString() !== req.user._id.toString()) {
            req.flash('error', 'That email is already in use');
            return res.status(400).redirect(`/auth/dashboard/${req.user._id}`)
        }
    }
    const user = await User.findByIdAndUpdate(req.user._id, body, {
        new: true,
    })
    req.session.user = user
    
    // sending a success message
    req.flash('success', 'Password Update successful');
    return res.status(200).redirect(`/auth/dashboard/${req.user._id}`)
    })
}

const updatePassword = async (req, res) => {
    const body = req.body

    if (!body.currentPassword || !body.newPassword || !body.confirmPassword) {
        // sending an error message 
        req.flash('error', 'Update information required');
        res.status(400).redirect(`/auth/dashboard/${req.user._id}`)
    }

    if (body.newPassword !== body.confirmPassword) {
        // sending an error message
        req.flash('error', 'Password does not match');
        return res.status(400).redirect(`/auth/dashboard/${req.user._id}`)
    }

    const user = await User.findById(req.user._id);

    isValid = authenticate(body.currentPassword, user.password);

    if (!isValid) {
        // sending an error message
        req.flash('error', 'Incorrect Password');
        return res.status(400).redirect(`/auth/dashboard/${req.user._id}`);
    }

    user.password = generatePasswordHash(body.newPassword);
    await user.save();
    
    // sending a success message 
    req.flash('success', 'Password Update Successful');
    return res.status(200).redirect(`/auth/dashboard/${req.user._id}`);
}

module.exports = {
    registerUser,
    renderRegisterUser,
    renderLoginUser,
    loginUser,
    renderDashboard,
    logoutUser,
    updateProfile,
    updatePassword
}