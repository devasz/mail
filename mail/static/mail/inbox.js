/*
Po załadowaniu zawartości DOM strony, do każdego z przycisków dołączamy słuchaczy zdarzeń. Po kliknięciu na przycisk
skrzynki Sent wywołujemy funkcję load_mailbox z argumentem 'sent'
 */
document.addEventListener('DOMContentLoaded', () => {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', compose_email);

    // Load the inbox (default)
    load_mailbox('inbox');
});

/*
Funkcja najpierw ukrywa podgląd wiadomości e-mail (ustawiając jej właściwość style.display na brak [none]) i pokazuje
podgląd kompozycji (ustawiając jej właściwość style.display na block). Następnie funkcja pobiera wszystkie pola
wejściowe formularza i ustawia ich wartość na pusty ciąg znaków '', aby je wyczyścić. Oznacza to, że za każdym razem,
gdy klikniesz przycisk "Komponuj", powinieneś otrzymać pusty formularz e-mail.
*/
function compose_email() {
    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#mail-body').style.display = 'none';
    // Clear out composition fields
    document.querySelector('#compose-recipients').value = "";
    document.querySelector('#compose-subject').value = "";
    document.querySelector('#compose-body').value = "";
}

/* W międzyczasie funkcja load_mailbox najpierw pokazuje widok e-maili, a następnie ukrywa widok compose-view. Funkcja
load_mailbox pobiera również argument, który będzie nazwą skrzynki pocztowej, którą użytkownik próbuje wyświetlić.
Funkcja load_mailbox wyświetli nazwę wybranej skrzynki poprzez aktualizację wewnętrznego HTML widoku wiadomości
(po kapitalizacji pierwszego znaku). Dlatego po wybraniu nazwy skrzynki w przeglądarce widzimy, że nazwa tej skrzynki
(pisana wielką literą) pojawia się w DOM-ie: funkcja load_mailbox aktualizuje podgląd wiadomości e-mail aby zawierał
odpowiedni tekst.

Jak wyswietlic dane JSON? => wpisz http://127.0.0.1:8000/emails/inbox. Wysłanie żądania GET do /emails/email_id, gdzie
email_id jest identyfikatorem liczby całkowitej dla danego emaila, zwróci reprezentację JSON-a. Jak uzyskać dostęp do
wartości JSON w JavaScript? Skorzystaj z fetch'a, aby złożyć zapytanie internetowe. Żądanie GET do /emails/inbox,
przekonwertuje wynikową odpowiedź na JSON, a następnie dostarczy ci tablicę
emaili wewnątrz zmiennych emaili == > .then(emails => {\i0}
*/
function load_mailbox(mailbox) {
    // Show the mailbox and hide compose-view
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';

    // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `
        <h4>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h4>`;

    fetch(`/emails/${mailbox}`)
        .then(response => response.json())
        .then(emails => {
            emails.forEach(element => {
                if (mailbox === "sent") {
                    from_to = element.recipients;
                } else {
                    from_to = element.sender;
                }

                // email read or unread
                if (mailbox === "inbox") {
                    if (element.read) {
                        is_read = "read";
                    } else {
                        is_read = "unread";
                    }
                } else is_read = "read";

                if (mailbox !== "archived") {
                    if (element.read) {
                        is_read = "read";
                    } else {
                        is_read = "unread";
                    }
                } else is_read = "";

                const item = document.createElement("div");

                item.className = `${is_read}`;
                item.innerHTML = `<div class="mb-2 mt-n2">
                <table class="table table-responsive-sm table-hover border" style="cursor:pointer;">
                <tr>
                    <td style="width:33%;">${from_to}</td>
                    <td style="width:34%;">${element.subject}</td>
                    <td style="width:33%;">${element.timestamp}</td>
                </tr>
                </table>
                </div>`;

                // Archive button in Inbox mailbox
                if (mailbox === 'inbox') {
                    const arch_btn = document.createElement('button');
                    arch_btn.className = "btn btn-sm alert-secondary shadow-sm";
                    arch_btn.textContent = "Archive"; //arch_btn.innerHTML = "Archive";
                    arch_btn.addEventListener('click', () => {
                        arch(element.id);
                    });
                    document.querySelector('#emails-view').append(arch_btn);
                }

                // Unrchive button in Archive mailbox
                if (mailbox === 'archive') {
                    const unarch_btn = document.createElement('button');
                    unarch_btn.className = "btn btn-sm alert-secondary shadow-sm";
                    unarch_btn.textContent = "Unarchive"; //unarch_btn.innerHTML = "Unarchive";
                    unarch_btn.addEventListener('click', () => {
                        unarch(element.id);
                    });
                    document.querySelector('#emails-view').append(unarch_btn);
                }

                document.querySelector("#emails-view").append(item);

                // Click email in DIV
                item.addEventListener("click", () => {
                    load_mail(element.id, mailbox);
                });
            });
        })
        .catch(error => {
            console.log('Error: ', error);
        });
}

// Email content
function load_mail(id) {
    fetch(`/emails/${id}`)
        .then((response) => response.json())
        .then((email) => {
            document.querySelector("#emails-view").innerHTML = "";
            const item = document.createElement("div");
            item.innerHTML = `<div class="my-3">
                <table class="table table-responsive-sm border">
                    <tr>
                        <th style="width:15%;">From</th>
                        <td style="width:85%;">${email.sender}</td>
                    </tr>  
                    <tr>
                        <th>To</th>
                        <td>${email.recipients}</td>
                    </tr>   
                    <tr>
                        <th>Subject</th>
                        <td>${email.subject}</td>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <td>${email.timestamp}</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="white-space: pre-wrap;">${email.body}</td>  
                    </tr>
                </table>
            </div>`;

            document.querySelector("#emails-view").appendChild(item);

            // Reply button
            const reply = document.createElement("btn");
            reply.className = `btn btn-block shadow-sm font-weight-bolder alert-primary`;
            reply.textContent = "Reply";
            reply.addEventListener("click", () => {
                reply_email(email.sender, email.subject, email.body, email.timestamp);
            });
            document.querySelector("#emails-view").appendChild(reply);
            make_read(id);
        });
}

function arch(id) {
    fetch(`/emails/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            archived: true,
        })
    })
    window.location.reload();
}

function unarch(id) {
    fetch(`/emails/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            archived: false,
        })
    })
    window.location.reload();
}

function make_archive(id, state) {
    fetch(`/emails/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            archived: !state,
        })
    }).then(() => load_mailbox('inbox'));
    // For IE browser
    // lub window.location.reload();
}

function make_read(id) {
    fetch(`/emails/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            read: true,
        })
    })
}

function reply_email(sender, subject, body, timestamp) {
    compose_email();
    // if (!/^Re:/.test(subject)) subject = `Re: ${subject}`;
    if (subject.slice(0, 4) !== "Re: ") subject = `Re: ${subject}`;
    document.querySelector("#compose-recipients").value = `${sender}`;
    document.querySelector("#compose-subject").value = `${subject}`;
    pre_body = `\n\n----------On ${timestamp} ${sender} wrote:\n${body}\n`;
    document.querySelector("#compose-body").value = pre_body;
}