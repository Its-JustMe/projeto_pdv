export function updateFormData (form, customerData) {
    form.name.value = customerData.Name;
    form.phone.value = customerData.Phone;
    form.address.value = customerData.Adress;
}

export function validateForm (form) {
    const formFields = [
        'delivery_option', 'delivery_fee',
        'phone', 'name', 'address'
    ];

    // Percorre todos os campos para verificar se estão vazios
    for (let field of formFields) {
        if (form[field].value === '') {
            alert('Campo vazio no formulário.');
            document.querySelector('.popup.info').style.display = 'block';
            form[field].classList.add('invalid');
            return false;
        }
    }

    if (form['customer_cep'].value !== '' && form['customer_cep'].value.length < 9 || form['customer_cep'].value.length > 9) {
        alert('Campo CEP inválido.');
        document.querySelector('.popup.info').style.display = 'block';
        form['customer_cep'].classList.add('invalid');
        return false;
    }

    return true;
}