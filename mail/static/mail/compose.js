// Aby wysłać e-mail, można wysłać żądanie POST na trasie /emails. Trasa ta wymaga przesłania trzech danych:
// wartości odbiorcy (ciąg znaków oddzielonych przecinkami od wszystkich użytkowników, do których ma zostać
// wysłany email), ciągu tematycznego oraz ciągu treści.

document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('#compose-form');

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const to = document.querySelector("#compose-recipients");
        const subject = document.querySelector("#compose-subject");
        const body = document.querySelector("#compose-body");

        if (from.length === 0 && to.length === 0 && subject.length === 0 && body.length === 0) return;

        fetch("/emails", {
            method: "POST",
            body: JSON.stringify({
                recipients: to.value,
                subject: subject.value,
                body: body.value,
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 201) {
                    load_mailbox("sent");
                } else {
                    alert(`${result.error}`);
                }
            })
    })
}, false
);