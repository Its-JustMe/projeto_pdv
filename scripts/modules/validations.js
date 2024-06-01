export function updateFormData (form, customerData) {
    form.name.value = customerData.Name;
    form.phone.value = customerData.Phone;
    form.address.value = customerData.Adress;
}