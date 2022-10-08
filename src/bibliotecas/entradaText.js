export default {
    cpf($event){
        let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
        if ((keyCode < 48 || keyCode > 57) && (keyCode !== 46) && (keyCode !== 45)) { 
            $event.preventDefault();
        }
    },
    celular($event){
        let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
        if ((keyCode < 48 || keyCode > 57) && (keyCode !== 32) && (keyCode !== 45)) { 
            $event.preventDefault();
        }
    },
    
}