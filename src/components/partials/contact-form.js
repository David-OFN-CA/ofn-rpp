import { LitElement, html, nothing } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { Task } from "@lit/task";
import { importCore, CLIENT_CONTEXT, uniq } from "@helpers/utils";

importCore().then((core) => {
  customElements.define(
    "custom-contact-form",
    class extends LitElement {
      constructor() {
        super();
      }

      static properties = {
        dataSrc: { attribute: "data-src" },
        uniq: { attribute: "uniq" },
      };

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
          "ofn:Wholesale_enquiry_preferences": await resource[
            "ofn:Wholesale_enquiry_preferences"
          ],
          "dfc-b:hasPhoneNumber": await resource["dfc-b:hasPhoneNumber"],
          "dfc-b:email": await resource["dfc-b:email"],
          "ofn:contact_email_endpoint_uri": await resource[
            "ofn:contact_email_endpoint_uri"
          ],
        };
        return response;
      }

      _getResource = new Task(this, {
        task: async ([dataSrc]) => {
          if (!dataSrc) return;
          const resource = await core.store.getData(dataSrc, CLIENT_CONTEXT);
          let response = await this._getProxyValue(resource);
          if (!response["ofn:Wholesale_enquiry_preferences"]) {
            response["ofn:Wholesale_enquiry_preferences"] = [];
          }
          return response;
        },
        args: () => [this.dataSrc],
      });

      /**
       * Toggles the valid/invalid class on the target element based on the isValid parameter.
       *
       * @param {Object} target - The target element's classList to toggle the class on
       * @param {boolean} [isValid=false] - Indicates whether the class should be valid or invalid
       * @return {boolean} - Indicates whether the class was successfully toggled
       */
      toggleClass(target, isValid = false) {
        if (!target) return false;
        if (isValid) {
          target.add("valid");
          target.remove("invalid");
        } else {
          target.add("invalid");
          target.remove("valid");
        }
        return true;
      }

      _submitForm(e) {
        let form = this.querySelector("form");
        let responseTarget = this.querySelector("form .response");
        if (form) {
          const formData = new FormData(form);
          let from = formData.get("from");
          let type = formData.get("type");
          this.toggleClass(
            form.querySelector("#from").classList,
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)
          );
          this.toggleClass(
            form.querySelector(".select-wrapper").classList,
            type !== null
          );
          if (from != "" && type != null) {
            fetch(form.action, {
              method: "POST",
              body: formData,
            })
              .then((response) => {
                if (response.ok) {
                  window._paq.push([
                    "trackContentInteractionNode",
                    this.querySelector("form"),
                    "submittedContactForm",
                  ]);
                  responseTarget.innerHTML = "Email submitted successfully";
                } else {
                  responseTarget.innerHTML = "Email submission failed";
                }
              })
              .catch(
                (_) => (responseTarget.innerHTML = "Error submitting email")
              );
          }
        }
        e.preventDefault();
      }

      updated() {
        M.FormSelect.init(this.querySelectorAll("select"));
      }

      render() {
        if (!this.dataSrc) return nothing;
        if (!this.uniq) this.uniq = uniq();

        return this._getResource.render({
          pending: () =>
            html`<div class="progress"><div class="indeterminate"></div></div>`,
          complete: (resource) => {
            let render = html``;
            render = html` <h4 id="${this.uniq}-contact-producer">
                Contact Producer
              </h4>
              <div class="row">
                <div class="col s12">
                  <div class="card-panel card-padding">
                    <div class="row">
                      ${resource["ofn:Wholesale_enquiry_preferences"].includes(
                        "Email"
                      ) ||
                      resource["ofn:Wholesale_enquiry_preferences"].includes(
                        "Phone"
                      )
                        ? html`
                            <div class="col s12 m3">
                              ${resource[
                                "ofn:Wholesale_enquiry_preferences"
                              ].includes("Phone")
                                ? html`
                                    <div
                                      class="row text-light no-margin-bottom"
                                    >
                                      <div class="col s12">Phone number</div>
                                    </div>
                                    <div
                                      class="row no-margin-bottom valign-wrapper"
                                    >
                                      <div
                                        class="col s12 text-link text-link-red"
                                      >
                                        <a
                                          href="tel:${resource[
                                            "dfc-b:hasPhoneNumber"
                                          ]}"
                                          target="_blank"
                                          >${resource[
                                            "dfc-b:hasPhoneNumber"
                                          ]}<icon-mdi-phone-in-talk
                                          ></icon-mdi-phone-in-talk
                                        ></a>
                                      </div>
                                    </div>
                                  `
                                : nothing}
                              ${resource[
                                "ofn:Wholesale_enquiry_preferences"
                              ].includes("Email")
                                ? html`
                                    <div
                                      class="row text-light no-margin-bottom"
                                    >
                                      <div class="col s12">Email address</div>
                                    </div>
                                    <div
                                      class="row no-margin-bottom valign-wrapper"
                                    >
                                      <div
                                        class="col s12 text-link text-link-red"
                                      >
                                        <a
                                          class="truncate"
                                          href="mailto:${resource[
                                            "dfc-b:email"
                                          ]}"
                                          target="_blank"
                                          >${resource[
                                            "dfc-b:email"
                                          ]}<icon-mdi-email-outline
                                          ></icon-mdi-email-outline
                                        ></a>
                                      </div>
                                    </div>
                                  `
                                : nothing}
                            </div>
                          `
                        : nothing}
                      <form
                        class=${classMap({
                          col: true,
                          s12: true,
                          m8:
                            resource[
                              "ofn:Wholesale_enquiry_preferences"
                            ].includes("Email") ||
                            resource[
                              "ofn:Wholesale_enquiry_preferences"
                            ].includes("Phone"),
                        })}
                        action="${resource["ofn:contact_email_endpoint_uri"]}"
                        method="post"
                      >
                        <h5>Contact form</h5>
                        <div class="row">
                          <div class="input-field col s12 m6">
                            <input
                              id="name"
                              name="name"
                              type="text"
                              class="validate"
                            />
                            <label for="name">Name</label>
                          </div>
                          <div class="input-field col s12 m6">
                            <select id="type" name="type" class="materialize">
                              <option value="" disabled selected>Type</option>
                              <option value="B2B / wholesale buyer">
                                B2B / wholesale buyer
                              </option>
                              <option value="household / consumer buyer">
                                Household / consumer buyer
                              </option>
                              <option value="general / other">
                                General / other
                              </option>
                            </select>
                            <span
                              class="helper-text"
                              data-error="You must select a type"
                              data-success=""
                            ></span>
                          </div>
                        </div>
                        <div class="row">
                          <div class="input-field col s12 m6">
                            <input
                              id="from"
                              name="from"
                              type="email"
                              pattern="[^@s]+@[^@s]+.[^@s]+"
                              class="validate"
                            />
                            <label for="from">Email address</label>
                            <span
                              class="helper-text"
                              data-error="Invalid email address"
                              data-success=""
                            ></span>
                          </div>
                        </div>
                        <div class="row">
                          <div class="input-field col s12">
                            <textarea
                              id="text"
                              name="text"
                              class="materialize-textarea"
                            ></textarea>
                            <label for="text">Message</label>
                          </div>
                        </div>
                        <input name="username" type="text" class="hidden" />
                        <div class="row hide-on-med-and-up right-align">
                          <div class="col s12">
                            <button
                              @click="${this._submitForm}"
                              class="waves-effect waves-light btn-small"
                            >
                              Send message
                            </button>
                          </div>
                        </div>
                        <div class="row hide-on-small-only">
                          <div class="col s12">
                            <button
                              @click="${this._submitForm}"
                              class="waves-effect waves-light btn-small"
                            >
                              Send message
                            </button>
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
            return render;
          },
          error: (e) => html`<p>Error while loading contact form.</p>`,
        });
      }
    }
  );
});
