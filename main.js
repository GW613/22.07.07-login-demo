let $loginForm = $('form[name=login]')
$loginForm.on('submit',(e)=>{
    e.preventDefault()
    let string = $loginForm.serialize()
    let errors =checkForm($loginForm)
    if(Object.keys(errors).length !==0){
        showErrors(errors,$loginForm)
    }else{
        $.ajax({
            url:$loginForm.attr('action'),
            method:$loginForm.attr('method'),
            data:string,
            success:function(response){
                location.href = "/home"
            },
            error:function(xhr){

            }})
    }

    function checkForm($loginForm){
        let email = $loginForm.find('[name=email]').val()
        let password = $loginForm.find('[name=password]').val()
        let errors ={}
         if(email.indexOf('@')<=0){
            errors.email = '邮箱不正确'
        }
        if(password.length<8){
            errors.password = '密码太短'
        }
        return errors
    }
    function showErrors(errors,$loginForm){
        let $loginError = $('.loginError')
        $loginError.text('')
        for (let key in errors){
            let value = errors[key]
            $loginForm.find(`[name = ${key}_error]`).text(value)
        }
    }
})



let $signUpForm = $('form[name=signUp]')
$signUpForm.on('submit',(e)=>{
    e.preventDefault()
   let string = $signUpForm.serialize()
    //check
    let errors = checkForm($signUpForm)


    if(Object.keys(errors).length !==0){
        showErrors(errors,$signUpForm)
    }else{
        $.ajax({
                   url:$signUpForm.attr('action'),
                   method:$signUpForm.attr('method'),
                   data:string,
                   success:function(response){
                       alert('注册成功')
                   },
                   error:function(xhr){
                       let errors =JSON.parse(xhr.responseText)
                       showErrors(errors,$signUpForm)
        }})
    }
    function checkForm($signUpForm){
        let email = $signUpForm.find('[name=email]').val()
        let password = $signUpForm.find('[name=password]').val()
        let password_confirmation = $signUpForm.find('[name=password_confirmation]').val()
        let errors ={}
        // if(email.indexOf('@')<=0){
        //     errors.email = '邮箱不正确'
        // }
        if(password.length<8){
            errors.password = '密码太短'
        }
        if(password_confirmation !== password){
            errors.password_confirmation = '两次输入密码不一致'
        }
        return errors
    }

    function showErrors(errors,$signUpForm){
        let $spanError = $('span.error')
        $spanError.text('')
        for (let key in errors){
            let value = errors[key]
            $signUpForm.find(`[name = ${key}_error]`).text(value)
        }
    }
})

