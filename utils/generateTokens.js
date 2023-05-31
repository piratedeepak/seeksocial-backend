import jwt from 'jsonwebtoken'

//generate access token
export const sendTokens = (user, res) => {
    const accessToken = jwt.sign({
        id:user._id
    }, process.env.ACCESS_SECRET, {expiresIn: '15m'})

    const accessOptions={
        // httpOnly:true,
        maxAge: 15 * 60 * 1000
    }
    res.status(200).cookie('accessToken', accessToken, accessOptions)

    const refreshToken = jwt.sign({
        id:user._id
    }, process.env.REFRESH_SECRET, {expiresIn: '15d'})

    const options={
        // httpOnly:true,
        maxAge:15*24*60*60*1000
    }  
    res.status(200).cookie('refreshToken', refreshToken, options)

}