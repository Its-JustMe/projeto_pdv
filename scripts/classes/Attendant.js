import { closePopup } from "../modules/interactions.js";

/** Classe responsável por controlar os vendedores */
export class Attendants {
    /**
     * 
     * @param {{
     *   "Id": string,
     *   "Name": string,
     *   "Phone": string,
     *  "Email": string,
     *   "Position": string,
     *   "Department": string,
     *   "Hire_date": string,
     *   "Sales_Count": string
     * } } data Dados do JSON de vendedores 
     */
    constructor (data) {
        this.data = data;
        this.selectedAttendant = null;

        this.allAttendants = document.querySelector('.attendant_grid');
    }

    /** Método que renderiza as informações de um determinado vendedor do DB 
     * @param attendant Dados do vendedor 
    */
    renderAttendantInfo (attendant) {
        return `
        <div class="attendant_container" id="${attendant.Id}">
            <div class="attendant_space flex_row">
                <div style="width: 35px; height: 35px; border-radius: 50%; background: linear-gradient(#257590, midnightblue);"></div>
                <input type="hidden" id="${attendant.Name}_${attendant.Id}" name="${attendant.Name}" value="${attendant.Id}">
                <div class="attendant_info">
                    <span class="attendant_jsonInfo">
                        <b>${attendant.Name}</b>
                    </span>
                    <br>
                    <span id="attendant_email" class="attendant_jsonInfo flex_row">
                        <i class="fa-solid fa-wallet" style="font-size: .8em"></i>
                        <span><b>Vendas:</b> ${attendant.Sales_Count}</span>
                    </span>
                </div>
            </div>
        </div>
        `;
    }

    /** Método que renderiza os dados dos vendedores */
    getAttendants () {
        this.data.forEach(attendant => {
            this.allAttendants.innerHTML += this.renderAttendantInfo(attendant);
        })
    }

    /** Método que seleciona um vendedor */
    changeSelectedAttendant () {
        document.querySelectorAll('.attendant_container').forEach(item => {
            item.addEventListener('click', () => {
                var obj = this.data.find(data => data.Id === item.id);
                this.selectedAttendant = obj;
                closePopup('attendant');
            });
        });       
    }
}