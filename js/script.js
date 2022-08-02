/***********************************************
*
*		filename: 	kalendarz aka script.js
*		  author:	Robert "mgn" Łuczak
* time of create:	long ago
*  last modified:	2018-12-28
*		 version:	1.1
*
************************************************/


var kalendarz = function()
{
	"use strict";

	/* Lista świąt stałych w formacie
		'miesiąc_dzień' bez zer poprzedzających: ['Nazwa święta', 'dayoff|workday']
			gdzie dayoff - dzień wolny, workday - dzień pracujący */
	this.swinta = {
		//styczeń
		'1_1':		['Nowy rok',										'dayoff'],
		'1_6':		['Święto Trzech Króli',								'dayoff'],
		'1_21':		['Dzień Babci',										'workday'],
		'1_22':		['Dzień Dziadka',									'workday'],
		//luty
		'2_14':		['Walentynki',										'workday'],
		//marzec
		'3_1':		['Dzień Puszystych',	'workday'],
		'3_5':		['Dzień Teściowej',									'workday'],
		'3_8':		['Dzień Kobiet',									'workday'],
		'3_10':		['Dzień Mężczyzn',									'workday'],
		'3_21': 	['Pierwszy Dzień Wiosny,<br />Dzień Wagarowicza',	'workday'],
		//Kwiecień
		'4_1':		['Prima Aprillis',									'workday'],
		//maj
		'5_1':		['Święto Pracy',									'dayoff'],
		'5_3':		['Święto Narodowe Trzeciego Maja',					'dayoff'],
		'5_26':		['Dzień Matki',										'workday'],
		//Czerwiec
		'6_1':		['Dzień Dziecka',									'workday'],
		'6_18':		['&#x2764;&#x2764;&#x2764;',						'workday'],
		'6_21':		['Pierwszy dzień lata',								'workday'],
		'6_23':		['Dzień Ojca',										'workday'],
		//lipiec
		//sierpień
		'8_15':		['Wniebowięcie Najświętszej Marii Panny',			'dayoff'],
		//Wrzesień
		'9_23':		['Pierwszy dzień jesieni',							'workday'],
		'9_30':		['Dzień Chłopaka',									'workday'],
		//październik
		'10_14':	['Dzień Nauczyciela',								'workday'],
		'10_19':	['Dzień Dziewczyny',								'workday'],
		'10_31':	['Halloween',										'workday'],
		//listopad
		'11_1':		['Wszystkich Świętych',								'dayoff'],
		'11_11':	['Święto Niepodległości',							'dayoff'],
		'11_25':	['Światowy Dzień Pluszowego Misia',					'workday'],
		'11_30':	['Andrzejki',										'workday'],
		//grudzień
		'12_6':		['Mikołajki',										'workday'],
		'12_24':	['Wigilia Bożego Narodzenia',						'workday'],
		'12_25':	['Boże narodzenie',									'dayoff'],
		'12_26':	['Boże narodzenie',									'dayoff'],
		'12_31':	['Sylwester',										'workday']
	}

	// wskazanie na obszar do generowania kalendarza
	this.c = $('#mainArea');

	//pobranie obecnej daty
	this.now = new Date();
	this.day = this.now.getDate(); //pobranie dnia miesiąca
	this.month = this.now.getMonth(); //pobranie miesiąca (licząc od 0!)
	this.year = this.now.getFullYear(); //pobranie roku

	//zdefiniowanie polskich nazw miesięcy oraz dni z uwzględnieniem kolumny dla numeracji tygodni
	this.months = ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'];
	this.days = ['Tydzień','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota','Niedziela'];
	this.daysShort = ['T.','Pn','Wt','Śr','Cz','Pt','So','N'];

	//funkcja odpowiedzialna za obliczanie daty wielkanocy metodą Meeusa/Jonesa/Butchera
	//http://www.algorytm.org/przetwarzanie-dat/wyznaczanie-daty-wielkanocy-metoda-meeusa-jonesa-butchera.html
	//in: rok, out: [dzien,miesiac]
	this.liczWielkanoc = function(rok)
	{
		var a,b,c,d,e,f,g,h,i,k,l,m,p;
		a = rok % 19;
		b = Math.floor(rok/100);
		c = rok % 100;
		d = Math.floor(b/4);
		e = b % 4;
		f = Math.floor((b+8)/25);
		g = Math.floor((b-f+1)/3);
		h = (19*a+b-d-g+15) % 30;
		i = Math.floor(c/4);
		k = c % 4;
		l = (32 + 2 * e + 2 * i - h - k) % 7;
		m = Math.floor((a + 11 * h + 22 * l) / 451);
		p = (h + l - 7 * m + 114) % 31;
		var dzien = p + 1;
		var miesiac = Math.floor((h + l - 7 * m + 114) / 31);
		return [dzien,miesiac];
	}

	//0 monday, 1 tuesday etc
	this.lastDayOfMonth = function(day,month,year)
	{

		var dni = ['poniedzialek','wtorek','sroda','czwartek','piatek','sobota','niedziela'];

		if (typeof day == 'string')
			day = dni.indexOf(day);

		if (day < 0)
			day = 0;

		day = day+1;

		if (day == 7)
			day = 0;

		var iloscDni = new Date(year, month, 0).getDate();

		var d;

		for (let i=0; i<7; i++)
		{
			d = new Date(year, month-1, iloscDni-i);
			if (d.getDay() == day)
				break;
		}
		return d;
	}

	this.lastSundayOfMonth = function(month, year) {
		month--;
		var lastDay = [31,28,31,30,31,30,31,31,30,31,30,31];
		if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) lastDay[2] = 29;
		var date = new Date();
		date.setFullYear(year, month, lastDay[month]);
		date.setDate(date.getDate()-date.getDay());
		return date.getDate();
	}


	//tablica pomocnicza do której zostaną skopiowane święta stałe
	this.s = {};

	//funkcja odpowiedzialna za dodanie święta do tablicy save
	//in: klucz,nazwaŚwięta,rodzaj, out: null
	this.addHoliday = function(key,holiday,type)
	{
		var types = {
			'dayoff': 0,
			'workday': 1
		};
		if (this.s.hasOwnProperty(key))
		{
			this.s[key][0] =  holiday + ',<br />' + this.s[key][0];
			if (types[this.s[key][1]] > types[type])
				this.s[key][1] = 'dayoff';
		}
		else
			this.s[key] = [holiday,type];

	}

	//funkcja odpowiedzialna za obliczanie i dodanie świąt ruchomych za pomocą
	//funkcji pomocniczych takich jak addHoliday() oraz liczWielkanoc()
	//in: y, out: null
	this.ruchome = function(y)
	{
		this.s = JSON.parse(JSON.stringify(this.swinta));

		var w = this.liczWielkanoc(y);
		var date = new Date(this.year,w[1]-1,w[0]);
		var wczw = new Date(date.setDate(date.getDate() - 3));
		this.addHoliday((wczw.getMonth()+1)+'_'+wczw.getDate(),'Wielki Czwartek','workday');

		var wpia = new Date(date.setDate(date.getDate() + 1));
		this.addHoliday((wpia.getMonth()+1)+'_'+wpia.getDate(),'Wielki Piątek','workday');

		var wsob = new Date(date.setDate(date.getDate() + 1));
		this.addHoliday((wsob.getMonth()+1)+'_'+wsob.getDate(),'Wielka Sobota','workday');

		var ponwiel = new Date(date.setDate(date.getDate() + 2));
		this.addHoliday((ponwiel.getMonth()+1)+'_'+ponwiel.getDate(),'Poniedziałek Wielkanocny','dayoff');

		var zielswia = new Date(date.setDate(date.getDate() + 48));
		this.addHoliday(zielswia.getMonth()+1+'_'+zielswia.getDate(),'Zielone Świątki','dayoff');

		var bocia = new Date(date.setDate(date.getDate() + 11));
		this.addHoliday(bocia.getMonth()+1+'_'+bocia.getDate(),'Boże Ciało','dayoff');

		this.addHoliday(w[1]+'_'+w[0],'Wielkanoc','dayoff');

		this.addHoliday('3_'+this.lastDayOfMonth('niedziela',3,this.year).getDate(),'Zmiana czasu na letni','workday');
		this.addHoliday('10_'+this.lastDayOfMonth('niedziela',10,this.year).getDate(),'Zmiana czasu na letni','workday');

	}

	//funkcja generująca blok html (span) dla swięta
	//in: dzien miesiaca, out: null
	this.swinto = function(dzien)
	{
		return (dzien in this.s) ? '<span class="swinto '+this.s[dzien][1]+'">'+this.s[dzien][0]+'</span>' : '';
	}

	//funkcja sprawdzająca czy danego dnia jest święto
	//in: dzień=>'miesiąc_dzień'; out: string
	this.isSwinto = function(dzien)
	{
		return (dzien in this.s) ? this.s[dzien] : false;
	}


	//funkcja obliczająca numer tygodnia na podstawie obiektu Date()
	//in: Date() obj; out: [full year, weekNo]
	Date.prototype.getWeekNumber = function(){
	  var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
	  var dayNum = d.getUTCDay() || 7;
	  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
	  return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
	};

	//funkcja odpowiedzialna za generowanie bloku numeru tygodnia
	//za pomocą funkcji getWeekNumber() która oblicza numer na podstawie
	//obiektu Date()
	//in: Date() obj, out: string
	this.weekNumber = function(date)
	{
		return '<div class="dBlock dWeek">'+date.getWeekNumber(date)+'</div>';
	}

	//funkcja generująca blok imieniny
	//in: miesiac, dzień; out: string
	this.blockImienin = function(miesiac,dzien)
	{
		return (typeof imieniny !== 'undefined') ? '<span class="imieniny">'+imieniny[miesiac][dzien]+'</span>' : '';
	}


	//przełącza miesąc lub rok wstecz
	//in: m=>true|false|undefined, out: null
	//jeśli m==true przełącza rok
	//podpięte pod przeycisk #month_prev, #year_prev
	this.prev = function(m)
	{
        if (m)
		{
			this.year--;
			this.ruchome(this.year);
		}
		else
		{
			this.month--;
			if (this.month < 0)
			{
				this.month = 11;
				this.year--;
				this.ruchome(this.year);
			}
		}
		this.draw();
	}

	//przełącza miesąc lub rok naprzód
	//in: m=>true|false|undefined, out: null
	//jeśli m==true przełącza rok
	//podpięte pod przeycisk #month_next, #year_next
	this.next = function(m)
	{
		if (m)
		{
			this.year++;
			this.ruchome(this.year);
		}
		else
		{
			this.month++;
			if (this.month > 11)
			{
				this.month = 0;
				this.year++;
				this.ruchome(this.year);
			}
		}
		this.draw();
	}

	//wraca do obecnego roku oraz miesiąca
	//podpięte pod przycisk #gotoday
	this.gotoday = function()
	{
		this.month = this.now.getMonth();
		this.year = this.now.getFullYear();
		this.ruchome(this.year);
		this.draw();
	}

	//zmienne pomocnicze do generowania pdf'a z kalendarzem
	this.doc = new jsPDF('l', 'mm');//zawiera obiekt pdf, tryb poziomy, wymiarowanie mm
	this.py_generating = false;		//flaga, true => obecnie trwa generowanie
	this.py_lastPage = false;		//flaga, true => nie jest ostatnia strona/miesiąc
	this.py_prevMonth = null;		//flaga, miesąc ostatnio widziany przed generowaniem

	//funkcja generująca pdf zawierająca cały miesiąc
	//in: null; out: null
	this.print_year = function()
	{
		if (!this.py_generating)
		{
			$('.today').removeClass('today');
			this.py_prevMonth = this.month;
			this.month = 0;
			this.draw();
			this.py_generating = true;
			this.py_lastPage = false;
		}

		if (this.py_generating && !this.py_lastPage)
		{
			var that = this;
			html2canvas(this.c.get(0), {
				logging: true,
				profile: true,
				useCORS: true
			}).then(function(canvas) {
				if (that.month > 0)
					that.doc.addPage();
				that.doc.addImage(canvas, 'PNG', 10, 10);
				that.next();
				if (that.month == 0)
					that.py_lastPage = true;
				that.print_year();
			});
		}

		if (this.py_generating && this.py_lastPage)
		{
			this.prev();
			this.py_generating = false;
			this.doc.save('kalendarz_'+this.year+'.pdf');
			this.doc = new jsPDF('l', 'mm');
			this.month = this.py_prevMonth;
			this.draw();
			//$('.transparenttoday').addClass('today');
		}
	}

	//funkcja generująca pdf z obecnym miesiącem
	this.print_month = function()
	{
		var miesiace = ['styczen','luty','marzec','kwiecien','maj','czerwiec','lipiec','sierpien','wrzesien','pazdziernik','listopad','grudzien'];
		var that = this;
		html2canvas(this.c.get(0), {
			logging: true,
			profile: true,
			useCORS: true
		}).then(function(canvas) {
			that.doc.addImage(canvas, 'PNG', 10, 10);
			that.doc.save(that.year+'_'+miesiace[that.month]+'.pdf');
			this.doc = new jsPDF('l', 'mm');
        });
	}

	this.loadCss = function(name)
	{
		$("<link/>", {
		   rel: "stylesheet",
		   type: "text/css",
		   href: name+".css",
		   id: "calendarcss"
		}).prependTo("head");
	}

	//funkcja rysuje kalendarz
	this.draw = function()
	{
		"use strict"; //tryb ścisły
		var that = this; //zmienna pomocnicza dla funkcji zewnętrznych

		var toAppend = '<div id="calendar_header"><div id="month">'+this.months[this.month]+'</div><div id="year">'+this.year+'</div></div>';//<div id="bg"></div>';
		$('#nav_month').html(this.months[this.month]+' '+this.year);
		var t;

		this.c.css('display','block').empty().append(toAppend);

		for (let d in this.days)
		{
			this.c.append('<div class="dBlock dNames '+(d == 0 ? 'dnamesFirst' : '')+(d == 7 ? 'dnamesLast' : '')+'">'+this.days[d]+'</div>');
			this.c.append('<div class="dBlock dNamesShort '+(d == 0 ? 'dnamesFirst' : '')+(d == 7 ? 'dnamesLast' : '')+'">'+this.daysShort[d]+'</div>');
		}

		var month = {
			prev: {
				days: new Date(this.year, this.month, 0).getDate(),
				m: new Date(this.year, this.month, 0).getMonth()
			},

			curr: {
				days: new Date(this.year, this.month+1, 0).getDate(),
				firstDay: new Date(this.year, this.month, 1).getDay(),
				m: new Date(this.year, this.month+1, 0).getMonth()
			},

			next: {
				days: new Date(this.year, this.month+2, 0).getMonth(),
				m: new Date(this.year, this.month+2, 0).getMonth()
			}
		};

		if (month.curr.firstDay === 0)
			month.curr.firstDay = 7;

		var przesuniecie = month.curr.days + month.curr.firstDay - 1;

		if (month.curr.firstDay > 1)
			this.c.append(this.weekNumber(new Date(this.year, this.month, 1)));

		for (let i=0; i < month.curr.firstDay - 1; i++)
		{
			t = month.prev.days-month.curr.firstDay+2+i;
			this.c.append('<div class="dBlock dSilver">'+t+this.blockImienin(month.prev.m,t)+this.swinto(month.prev.m+1+'_'+t)+'</div>');
		}


		for (let i = month.curr.firstDay-1; i<przesuniecie; i++) {

			t = i - month.curr.firstDay + 2;

			if((i % 7) == 0)
				this.c.append(this.weekNumber(new Date(this.year, this.month, t)));

			toAppend = '<div class="dBlock'+(((i+1) % 7) == 0 || this.isSwinto(this.month+1+'_'+t)[1] == 'dayoff' ? ' dRed' : '')+(this.year == new Date().getFullYear() && this.month == new Date().getMonth() && t == new Date().getDate() ? ' today transparenttoday' : '')+'">'+t;

			toAppend += this.blockImienin(this.month,t);

			toAppend += this.swinto(this.month+1+'_'+t);

			toAppend += '</div>';

			this.c.append(toAppend);

		}

		var pozostale = 35 - przesuniecie;

		if (pozostale < 0)
			pozostale = 7 + pozostale;

		for (let i=1; i <= pozostale; i++)
			this.c.append('<div class="dBlock dSilver">'+(i)+this.blockImienin(month.next.m,i)+'</span>'+this.swinto(month.next.m+1+'_'+i)+'</div>');


		if (pozostale == 0)
			for (let i=0; i < 8; i++)
			{
				if (i == 0)
					toAppend = this.weekNumber(new Date(this.year, this.month+2, i));
				else
					toAppend = '<div class="dBlock dSilver">'+(i)+this.blockImienin(month.next.m,i)+'</span>'+this.swinto(month.next.m+1+'_'+i)+'</div>';

				this.c.append(toAppend);
			}

		//var temd = [];
		//for (let i=0; i<=7; i++)
			//console.log(this.lastSunayOfMonth(this.month,this.year)+', i: '+i+', ostatni '+this.days[i]);
		//console.log(temd);
		//console.log(this.lastDayOfMonth(6,this.month,this.year));

	}

	//+(this.year == new Date().getYear() & this.month = new Date().getMonth() && t == new Date().getDate() ? ' today' : '')
	//console.log(new Date().getFullYear());
	//console.log(new Date().getDate());

	var that = this; //zmienna pomocnicza dla funkcji zewnętrznych

	//przypisanie funkcji do przycisków na stronie
	$('#month_prev').click(function(){that.prev();});
	$('#month_next').click(function(){that.next();});
	$('#year_prev').click(function(){that.prev(true);});
	$('#year_next').click(function(){that.next(true);});
	$('#month_print').click(function(){that.print_month();});
	$('#year_print').click(function(){that.print_year();});
	$('#gotoday').click(function(){that.gotoday();});

	if (location.hash.replace('#','') == '')
		this.loadCss('style');
	else
		this.loadCss(location.hash.replace('#',''));

	this.prevHash = location.hash.replace('#','');

	setInterval(function(){
		if (location.hash.replace('#','') !== that.prevHash)
		{
			that.prevHash = location.hash.replace('#','');
			$('#calendarcss').remove();
			that.loadCss(location.hash.replace('#',''));
		}
	},200);

	this.ruchome(this.year);  //wstępne obliczanie świąt ruchomych
	this.draw();	//rysowanie kalendarza

	//$('.today').removeClass('today');
}

$(document).ready(function(){
	console.log(location.hash.replace('#',''));
	var k = new kalendarz(); //uwolnienie kodu kiedy reszta dokumentu jest gotowa (ready())
});
