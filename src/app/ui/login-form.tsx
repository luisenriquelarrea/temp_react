function LoginForm(){
    return(
        <>
            <div className="field">
                <label className="label">Username</label>
                <div className="control">
                    <input className="input" type="text" placeholder="username" />
                </div>
            </div>
            <div className="field">
                <label className="label">Password</label>
                <div className="control">
                    <input className="input" type="password" placeholder="Password" />
                </div>
            </div>
            <div className="field">
                <div className="control">
                    <button className="button is-success">Login</button>
                </div>
            </div>
        </>
    );
}

export default LoginForm;