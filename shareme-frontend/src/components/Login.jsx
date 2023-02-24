import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import axios from 'axios'
import { useGoogleOneTapLogin, useGoogleLogin } from '@react-oauth/google';
// import { useGoogleLogin } from 'react-use-googlelogin'
import { client } from '../client'
const Login = () => {
    const navigate = useNavigate()
    // const login = useGoogleLogin({

    //     onSuccess: tokenResponse => {
    //         console.log(tokenResponse)
    //         localStorage.setItem('user', JSON.stringify(tokenResponse))
    //         const { name, googleId, imageUrl } = tokenResponse
    //         const doc = {
    //             _id: googleId,
    //             _type: 'user',
    //             userName: name,
    //             image: imageUrl
    //         }
    //         client.createIfNotExists(doc).then(() => navigate('/', { replace: true }))
    //     }
    // });
    const login = useGoogleLogin({

        onSuccess: async tokenResponse => {
            console.log(tokenResponse)
            const res = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + tokenResponse.access_token)
            let userData = { ...res.data, ...tokenResponse }

            localStorage.setItem('user', JSON.stringify(userData))
            const { name, id, picture } = userData
            const doc = {
                _id: id,
                _type: 'user',
                userName: name,
                image: picture
            }
            client.createIfNotExists(doc).then((d) => {
                console.log(d)
                navigate('/home', { replace: true })
            })
        }

    });
    // const login = () => {

    // }
    useGoogleOneTapLogin({
        onSuccess: credentialResponse => {
            console.log(credentialResponse);
            navigate('/home', { replace: true })
        },
        onError: () => {
            console.log('Login Failed');
        },
    });
    return (
        <div className='flex flex-col items-center justify-start h-screen'>
            <div className='relative w-full h-full'>
                <video src={shareVideo} type="video/mp4" autoPlay loop muted className='absolute object-cover w-full h-full' controls={false} />
            </div>
            <div className='absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center'>
                <div className='p-5'>
                    <img src={logo} alt="logo" width="130px" />

                </div>
                <div className='shadow-2xl'>
                    {/* <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                        render={renderProps => (
                            <button
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                type="submit" className='flex items-center justify-center p-3 rounded-lg outline-none cursor-pointer bg-mainColor'><FcGoogle className='mr-4' /> Sign in with Google
                            </button>
                        )}
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy="single_host_origin"
                    /> */}
                    {/* <GoogleLogin
                        onSuccess={credentialResponse => {
                            console.log(credentialResponse);
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    /> */}
                    <button
                        onClick={login}
                        // disabled={renderProps.disabled}
                        type="submit" className='flex items-center justify-center p-3 rounded-lg outline-none cursor-pointer bg-mainColor'><FcGoogle className='mr-4' /> Sign in with Google
                    </button>

                </div>
            </div>
        </div>
    )
}

export default Login
