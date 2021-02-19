from django.urls import path

from . import views

# Wysłanie żądania GET do /emails/<mailbox>, gdzie <mailbox> jest albo skrzynką odbiorczą, albo wysłaną,
# albo archiwum zwróci Ci (w formie JSON) listę wszystkich wiadomości w tej skrzynce, w odwrotnej
# kolejności chronologicznej. Jak można uzyskać dostęp do takich wartości w JavaScript? Przypomnijmy,
# że w JavaScript możesz skorzystać z fetch'a, aby złożyć zapytanie internetowe.

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("emails", views.compose, name="compose"),
    path("emails/<int:email_id>", views.email, name="email"),
    path("emails/<str:mailbox>", views.mailbox, name="mailbox"),
]
