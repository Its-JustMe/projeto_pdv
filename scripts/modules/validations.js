export function updateFormData (form, customerData) {
    form.name.value = customerData.Name;
    form.phone.value = customerData.Phone;
    form.address.value = customerData.Adress;
}

export function validateForm (form) {
    if (!isEmptyField(form) || !validateDeliveryFeeField(form)) {
        return false;
    }

    return true;
}

function isEmptyField (form) {
    const formFields = [
        'delivery_option', 'phone', 
        'name', 'address'
    ];

    // Percorre todos os campos para verificar se estão vazios
    for (let field of formFields) {
        if (form[field].value === '') {
            displayNotify('Erro(s) no formulário', 'Verifique se há campos vazios.', 'error');
            document.querySelector('.popup.info').style.display = 'block';
            form[field].classList.add('invalid');
            
            return false;
        }
    }

    if (form['customer_cep'].value !== '' && form['customer_cep'].value.length < 9 || form['customer_cep'].value.length > 9) {
        displayNotify('Erro(s) no formulário', 'Campo CEP inválido.', 'error');
        document.querySelector('.popup.info').style.display = 'block';
        form['customer_cep'].classList.add('invalid');

        return false;
    }

    return true;
}

function validateDeliveryFeeField (form) {
    if (form.delivery_fee.value === '' || form.delivery_fee.value === '0') {
        if (form.delivery_option.value === 'Retirada na loja') {
            form.delivery_fee.value = 0.00;
            return true;
        }
        displayNotify('Erro(s) no formulário', 'É necessário inserir um valor de entrega.', 'error');
        return false;
    }

    form.delivery_fee.value.replace(',', '.');

    return true;
}

export const displayNotify = function (toastTitle, toastText, statusType, duration = 8000) {
    new Notify({
        status: statusType,
        title: toastTitle,
        text: toastText,
        effect: 'fade',
        speed: 500,
        showIcon: true,
        showCloseButton: true,
        autoClose: true,
        autoTimeout: duration,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'bottom-right' 
    });
}