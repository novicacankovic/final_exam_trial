$(document).ready(function () {

    // podaci od interesa
    var host = window.location.host;
    var token = null;
    var headers = {};
    var nekretnineEndpoint = "/api/nekretnine/";
    var editingId;
    console.log('dddd', editingId);
    var formAction = "Create";

    // okidanje ucitavanja proizvoda
    loadNekretnine();

    // posto inicijalno nismo prijavljeni, sakrivamo odjavu
    $("#odjava").css("display", "none");

    // pripremanje dogadjaja za izmenu i brisanje
    $("body").on("click", "#btnDelete", deleteNekretnine);
    $("body").on("click", "#btnEdit", editNekretnine);
    $("body").on("click", "#btnOdustajanje", formaOdustajanje);
    $("body").on("click", "#btnOdustani", formaOdustajanje1);
    $("body").on("click", "#btnReset", loadNekretnine);

    $("body").on("click", "#btnRegistracijaIPrijava", registracijaIPrijava);
    $("body").on("click", "#btnPocetak", pocetak);
    $("body").on("click", "#btnRegistracija", registracijaForma);
    $("body").on("click", "#btnPrijava", prijavaForma);

    function registracijaIPrijava() {
        $("#registracijaIPrijava").css("display", "none");
        $("#pocetak").css("display", "block");
        $("#registracija").css("display", "block");
    }

    function pocetak() {
        $("#pocetak").css("display", "none");
        $("#registracijaIPrijava").css("display", "block");
        $("#registracija").css("display", "none");
        $("#prijava").css("display", "none");
    }

    function registracijaForma() {
        $("#prijava").css("display", "none");
        $("#registracija").css("display", "block");
        $("#registracijaIPrijava").css("display", "none");

    }

    function prijavaForma() {
        $("#prijava").css("display", "block");
        $("#registracija").css("display", "none");
        $("#registracijaIPrijava").css("display", "none");

    }

    // ucitavanje Nekretnina
    function loadNekretnine() {
        var requestUrl = 'http://' + host + nekretnineEndpoint;
        $.getJSON(requestUrl, setNekretnine);
    }

    // metoda za postavljanje nekretnina u tabelu
    function setNekretnine(data, status) {

        var $container = $("#nekretnine");
        $container.empty();

        if (status === "success") {
            // ispis naslova
            var div = $("<div></div>");
            var h1 = $("<h1>Nekretnine</h1>");
            div.append(h1);
            // ispis tabele
            var table = $("<table class='table table-bordered'></table>");
            if (token) {
                var header = $("<thead ><tr style='background-color:#ff0000'><td>Mesto</td><td>Oznaka</td><td>Izgradnja</td><td>Kvadratura</td><td>Cena</td><td>Agent</td><td>Brisanje</td><td>Izmena</td></tr></thead>");
            } else {
                header = $("<thead><tr class='info'><td>Mesto</td><td>Oznaka</td><td>Izgradnja</td><td>Kvadratura</td><td>Cena</td><td>Agent</td></tr></thead>");
            }

            table.append(header);
            tbody = $("<tbody></tbody>");
            for (i = 0; i < data.length; i++) {
                // prikazujemo novi red u tabeli
                var row = "<tr>";
                // prikaz podataka
                var displayData = "<td>" + data[i].Mesto + "</td><td>" + data[i].AgencijskaOznaka + "</td><td>" + data[i].GodinaIzgradnje + "</td><td>" + data[i].Kvadratura + "</td><td>" + data[i].Cena + "</td><td>" + data[i].Agent.ImeIPrezime + "</td>";
                // prikaz dugmadi za izmenu i brisanje
                var stringId = data[i].Id.toString();
                var displayDelete = "<td><button class='btn btn-danger' id=btnDelete name=" + stringId + ">Delete</button></td>";
                var displayEdit = "<td><button button class='btn btn-primary' id=btnEdit name=" + stringId + ">Edit</button></td>";
                // prikaz samo ako je korisnik prijavljen
                if (token) {
                    row += displayData + displayDelete + displayEdit + "</tr>";
                } else {
                    row += displayData + "</tr>";
                }
                // dodati red
                tbody.append(row);
            }
            table.append(tbody);

            div.append(table);

            $container.append(div);
        }
        else {
            var div = $("<div></div>");
            var h1 = $("<h1>Greška prilikom preuzimanja Nekretnine!</h1>");
            div.append(h1);
            $container.append(div);
        }
    }
    // registracija korisnika
    $("#registracija").submit(function (e) {
        e.preventDefault();


        var email = $("#regEmail").val();
        var loz1 = $("#regLoz").val();
        var loz2 = $("#regLoz2").val();

        // objekat koji se salje
        var sendData = {
            "Email": email,
            "Password": loz1,
            "ConfirmPassword": loz2
        };

        $.ajax({
            type: "POST",
            url: 'http://' + host + "/api/Account/Register",
            data: sendData

        }).done(function (data) {
            alert("Uspešna registracija na sistem!");
            $("#info").append("Uspešna registracija. Možete se prijaviti na sistem.");




        }).fail(function (data) {
            alert('Greška prilikom registracije! Proverite unos!');
        });
    });

    // prijava korisnika
    $("#prijava").submit(function (e) {
        e.preventDefault();

        var email = $("#priEmail").val();
        var loz = $("#priLoz").val();

        // objekat koji se salje
        var sendData = {
            "grant_type": "password",
            "username": email,
            "password": loz
        };

        $.ajax({
            "type": "POST",
            "url": 'http://' + host + "/Token",
            "data": sendData

        }).done(function (data) {
            console.log(data);
            $("#info").empty().append("Prijavljen korisnik: " + data.userName);
            token = data.access_token;
            $("#prijava").css("display", "none");
            $("#registracija").css("display", "none");
            $("#registracijaIPrijava").css("display", "none");
            $("#formaDodavanja").css("display", "block");

            $("#odjava").css("display", "block");
            $("#formsearch").css("display", "block");
            $("#priEmail").val('');
            $("#priLoz").val('');
            refreshTable();

            //i uvucena forma za selektovanje agenta prilikom dodavanja istog
            var selectList = $("#agent1");
            selectList.empty();
            $.ajax({
                url: 'http://' + host + '/api/agenti',
                type: "GET",
                headers: headers
            }).done(function (agenti, status) {
                console.log('wwwwwwwwwwwwww', agenti);
                for (i = 0; i < agenti.length; i++) {
                    var displayData = '<option selected value=' + agenti[i].Id + '>' + agenti[i].ImeIPrezime + '</option>';

                    selectList.append(displayData);
                }
            })
                .fail(function (agenti, status) {
                    formAction = "Create";
                    alert("Desila se greska!");
                });



        }).fail(function (data) {
            alert('Greška prilikom prijave');
        });
    });



    // odjava korisnika sa sistema
    $("#odjavise").click(function () {
        token = null;
        headers = {};

        $("#prijava").css("display", "none");
        $("#registracija").css("display", "none");
        $("#registracijaIPrijava").css("display", "block");
        $("#pocetak").css("display", "none");
        $("#odjava").css("display", "none");
        $("#info").empty();
        $("#sadrzaj").empty();
        $("#formNekretninaDiv").css("display", "none");
        $("#formaDodavanja").css("display", "none");
        $("#formsearch").css("display", "none");

        refreshTable();
    });



    // forma za rad sa Nekretninama
    //izmena
    $("#nekretninaForm").submit(function (e) {
        // sprecavanje default akcije forme
        e.preventDefault();

        // korisnik mora biti ulogovan
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        var mesto = $("#mesto").val();
        var oznaka = $("#oznaka").val();
        var izgradnja = $("#izgradnja").val();
        var kvadratura = $("#kvadratura").val();
        var cena = $("#cena").val();
        var agent = $("#agent").val();
        var httpAction;
        var sendData;
        var url;

        // u zavisnosti od akcije pripremam objekat
        if (formAction === "Create") {
            console.log('usaoooooo u create');
            httpAction = "POST";
            url = 'http://' + host + nekretnineEndpoint;
            sendData = {
                "Mesto": mesto,
                "AgencijskaOznaka": oznaka,
                "GodinaIzgradnje": izgradnja,
                "Kvadratura": kvadratura,
                "Cena": cena,
                "AgentId": agent
            };
        }
        else {
            console.log('aaaaaa');
            httpAction = "PUT";
            url = 'http://' + host + nekretnineEndpoint + editingId.toString();
            sendData = {
                "Id": editingId,
                "Mesto": mesto,
                "AgencijskaOznaka": oznaka,
                "GodinaIzgradnje": izgradnja,
                "Kvadratura": kvadratura,
                "Cena": cena,
                "AgentId": agent
            };
            console.log('ssssssss', sendData);
        }
        // izvrsavanje AJAX poziva
        $.ajax({
            url: url,
            type: httpAction,
            headers: headers,
            data: sendData
        })
            .done(function (data, status) {
                console.log('doneeeee', data);
                formAction = "Create";
                refreshTable();
                $("#formNekretnina").css("display", "none");
            })
            .fail(function (data, status) {
                alert("Greška prilikom izmene!");
            });
    });

    //Dodavane novog zaposlenog
    $("#nekretninaNova").submit(function (e) {

        // sprecavanje default akcije forme
        e.preventDefault();

        // korisnik mora biti ulogovan
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }


        var mesto = $("#mesto1").val();
        var oznaka = $("#oznaka1").val();
        var izgradnja = $("#izgradnja1").val();
        var kvadratura = $("#kvadratura1").val();
        var cena = $("#cena1").val();
        var agent = $("#agent1").val();
        var httpAction;
        var sendData;
        var url;

        // u zavisnosti od akcije pripremam objekat
        formAction === "Create";
        httpAction = "POST";
        url = 'http://' + host + nekretnineEndpoint;
        sendData = {
            "Mesto": mesto,
            "AgencijskaOznaka": oznaka,
            "GodinaIzgradnje": izgradnja,
            "Kvadratura": kvadratura,
            "Cena": cena,
            "AgentId": agent
        };

        $.ajax({
            url: url,
            type: httpAction,
            headers: headers,
            data: sendData
        })
            .done(function (data, status) {
                formAction = "Create";
                refreshTable();
                $("#formaDodavanja").css("display", "none");
                alert("Nekretnina je uspesno dodata!");

            })
            .fail(function (data, status) {
                alert("Greška prilikom izmene!");
            });
    });



    //pretraga
    $("#searchForm").submit(function (e) {
        e.preventDefault();

        // korisnik mora biti ulogovan
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var miniKvadratura = $("#miniKvadratura").val();
        var maxiKvadratura = $("#maxiKvadratura").val();

        var httpAction;
        var sendData;
        var url;

        httpAction = "POST";
        url = 'http://' + host + "/api/pretraga/";
        sendData = {
            "Mini": miniKvadratura,
            "Maksi": maxiKvadratura
        };

        $.ajax({
            url: url,
            type: httpAction,
            headers: headers,
            data: sendData
        })
            .done(function (data, status) {
                $("#miniKvadratura").val('');
                $("#maxiKvadratura").val('');
                setNekretnine(data, status);
            })
            .fail(function (data, status) {
                alert("Greška prilikom pretrage!");
            });
    });

    // brisanje Nekretnina
    function deleteNekretnine() {
        // izvlacimo {id}
        var deleteID = this.name;

        // korisnik mora biti ulogovan
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        // saljemo zahtev 
        $.ajax({
            url: 'http://' + host + nekretnineEndpoint + deleteID.toString(),
            type: "DELETE",
            headers: headers
        })
            .done(function (data, status) {
                refreshTable();
            })
            .fail(function (data, status) {
                alert("Desila se greska!");
            });
    }

    // izmena nekretnina
    function editNekretnine() {
        // izvlacimo id
        var editId = this.name;

        // korisnik mora biti ulogovan
        if (token) {
            headers.Authorization = 'Bearer ' + token;
            $("#formNekretninaDiv").css("display", "block");

        }

        var selectList = $("#agent");
        selectList.empty();
        $.ajax({
            url: 'http://' + host + '/api/agenti',
            type: "GET",
            headers: headers
        }).done(function (agenti, status) {
            for (i = 0; i < agenti.length; i++) {
                if (editId === agenti[i].Id) {
                    var displayData = '<option selected value=' + agenti[i].Id + '>' + agenti[i].ImeIPrezime + '</option>';
                }
                else {
                    var displayData = '<option value=' + agenti[i].Id + '>' + agenti[i].ImeIPrezime + '</option>';
                }
                selectList.append(displayData);
            }
        })
            .fail(function (agenti, status) {
                formAction = "Create";
                alert("Desila se greska!");
            });

        // saljemo zahtev da dobavimo nekretnina
        $.ajax({
            url: 'http://' + host + nekretnineEndpoint + editId.toString(),
            type: "GET",
            headers: headers
        })
            .done(function (data, status) {
                $("#mesto").val(data.Mesto);
                $("#oznaka").val(data.AgencijskaOznaka);
                $("#izgradnja").val(data.GodinaIzgradnje);
                $("#kvadratura").val(data.Kvadratura);
                $("#cena").val(data.Cena);
                $("#agent").val(data.AgentId);
                editingId = data.Id;
                formAction = "PUT";


            })
            .fail(function (data, status) {
                formAction = "Create";
                alert("Greška prilikom izmene!");
            });

    }

    // osvezi prikaz tabele
    function refreshTable() {
        // cistim formu
        $("#mesto").val('');
        $("#oznaka").val('');
        $("#izgradnja").val('');
        $("#kvadratura").val('');
        $("#cena").val('');
        $("#agent").val('');
        // osvezavam
        loadNekretnine();
    }

    function formaOdustajanje() {
        $("#mesto").val('');
        $("#oznaka").val('');
        $("#izgradnja").val('');
        $("#kvadratura").val('');
        $("#cena").val('');
        $("#agent").val('');
        loadNekretnine();
        $("#formNekretnineDiv").css("display", "none");
    }

    function formaOdustajanje1() {
        $("#mesto1").val('');
        $("#oznaka1").val('');
        $("#izgradnja1").val('');
        $("#kvadratura1").val('');
        $("#cena1").val('');
        $("#agent1").val('');
        loadNekretnine();
        $("#formaDodavanja").css("display", "block");
    }
});