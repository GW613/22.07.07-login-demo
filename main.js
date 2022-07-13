let $signUpForm = $('form[name=signUp]')
$signUpForm.on('submit',(e)=>{
    e.preventDefault()
   let string = $signUpForm.serialize()
    let email = $signUpForm.find('[name=email]').val()
    let password = $signUpForm.find('[name=password]').val()
    let password_confirmation = $signUpForm.find('[name=password_confirmation]').val()
    //check
    let errors ={}
    if(email.indexOf('@')<=0){
        errors.email = '邮箱不正确'
    }
    if(password.length<8){
        errors.password = '密码太短'
    }
    if(password_confirmation !== password){
        errors.password_confirmation = '两次输入密码不一致'
    }
    let $spanError = $('span.error')
    $spanError.text('')

    if(Object.keys(errors).length !==0){
        for (let key in errors){
            let value = errors[key]
            $signUpForm.find(`[name = ${key}_error]`).text(value)
        }
        return
    }

    $.ajax({
        url:$signUpForm.attr('action'),
        method:$signUpForm.attr('method'),
        data:string,
        success:function(response){
            let object = JSON.parse(response)
            console.log(object);
        }
    })
})