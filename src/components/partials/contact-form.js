import { LitElement, html } from "lit";
import { Task } from "@lit/task";
import { importCore, CLIENT_CONTEXT, uniq } from '@helpers/utils';

importCore().then(core => {
  customElements.define(
    "custom-contact-form",
    class extends LitElement {
      constructor() {
        super();
      }

      static properties = {
        dataSrc: { attribute: "data-src" },
        uniq: { attribute: "uniq" },
      }

      createRenderRoot() {
        return this;
      }

      /**
       * Asynchronously gets the proxy value for the given resource.
       *
       * @param {proxy} resource - description of resource
       * @return {object} response containing the serialized resource
       */
      async _getProxyValue(resource) {
        let response = {
          "ofn:Wholesale_enquiry_preferences": await resource["ofn:Wholesale_enquiry_preferences"],
          "dfc-b:hasPhoneNumber": await resource["dfc-b:hasPhoneNumber"],
          "dfc-b:email": await resource["dfc-b:email"],
          "ofn:contact_email_endpoint_uri": await resource["ofn:contact_email_endpoint_uri"],
        };
        return response;
      }

      _getResource = new Task(this, {
        task: async ([dataSrc]) => {
          if(!dataSrc) return;
          const resource = await core.store.getData(dataSrc, CLIENT_CONTEXT);
          let response = await this._getProxyValue(resource);
          return response;
        },
        args: () => [this.dataSrc]
      })

      _submitForm(e) {
        let form = this.querySelector("form");
        let responseTarget = this.querySelector("form .response");
        if(form) {
          const formData = new FormData(form);
          fetch(form.action, {
            method: 'POST',
            body: formData
          }).then(response => {
            if(response.ok) {
              responseTarget.innerHTML = 'Email submitted successfully';
            } else {
              responseTarget.innerHTML = 'Email submission failed';
            }
          }).catch(_ => responseTarget.innerHTML = 'Error submitting email');
        }
        e.preventDefault();
      }

      updated() {
        M.FormSelect.init(this.querySelectorAll("select"));
      }

      render() {
        if(!this.dataSrc) return html``;
        if(!this.uniq) this.uniq = uniq();

        return this._getResource.render({
          pending: () => html`<div class="progress"><div class="indeterminate"></div></div>`,
          complete: (resource) => {
            let render = html``;
            if(resource["ofn:Wholesale_enquiry_preferences"]) {
              if(resource["ofn:Wholesale_enquiry_preferences"].includes("Email")) {
                render = html`
                <h4 id="${this.uniq}-contact-producer">Contact Producer</h4>
                <div class="row">
                  <div class="col s12">
                    <div class="card-panel card-padding">
                      <div class="row">
                        <div class="col s12 m3">
                          ${resource["ofn:Wholesale_enquiry_preferences"].includes("Phone") ? html`
                          <div class="row text-light no-margin-bottom">
                            <div class="col s12">Phone number</div>
                          </div>
                          <div class="row no-margin-bottom valign-wrapper">
                            <div class="col s12 text-link text-link-red">
                              <a href="tel:${resource["dfc-b:hasPhoneNumber"]}" target="_blank">${resource["dfc-b:hasPhoneNumber"]}&nbsp;<icon-mdi-phone-in-talk></icon-mdi-phone-in-talk></a>
                            </div>
                          </div>
                          ` : html``}
                          <div class="row text-light no-margin-bottom">
                            <div class="col s12">Email address</div>
                          </div>
                          <div class="row no-margin-bottom valign-wrapper">
                            <div class="col s12 text-link text-link-red">
                              <a href="mailto:${resource["dfc-b:email"]}" target="_blank">${resource["dfc-b:email"]}&nbsp;<icon-mdi-email-outline></icon-mdi-email-outline></a>
                            </div>
                          </div>
                        </div>
                        <form class="col s12 m8" action="${resource["ofn:contact_email_endpoint_uri"]}" method="post">
                          <h5>Contact form</h5>
                          <div class="row">
                            <div class="input-field col s12 m6">
                              <input id="name" name="name" type="text" class="validate">
                              <label for="name">Name</label>
                            </div>
                            <div class="input-field col s12 m6">
                              <select id="type" name="type" class="materialize">
                                <option value="" disabled selected>Type</option>
                                <option value="B2B / wholesale buyer">B2B / wholesale buyer</option>
                                <option value="household / consumer buyer">Household / consumer buyer</option>
                                <option value="general / other">General / other</option>
                              </select>
                            </div>
                          </div>
                          <div class="row">
                            <div class="input-field col s12 m6">
                              <input id="from" name="from" type="email" class="validate">
                              <label for="from">Email address</label>
                            </div>
                          </div>
                          <div class="row">
                            <div class="input-field col s12">
                              <textarea id="text" name="text" class="materialize-textarea"></textarea>
                              <label for="text">Message</label>
                            </div>
                          </div>
                          <div class="row hide-on-med-and-up right-align">
                            <div class="col s12">
                              <button
                                @click="${this._submitForm}"
                                class="waves-effect waves-light btn-small"
                              >Send message</button>
                            </div>
                          </div>
                          <div class="row hide-on-small-only">
                            <div class="col s12">
                              <button
                                @click="${this._submitForm}"
                                class="waves-effect waves-light btn-small"
                              >Send message</button>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col s12 response"></div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>`;
              }
            }
            return render;
          },
          error: (e) => html`<p>Error while loading contact form.</p>`
        });
      }
    }
  );
});
