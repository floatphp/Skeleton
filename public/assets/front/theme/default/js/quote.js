var collecte_type_id = '4';
var collecte_type_name = '';
// 
vud_referer = document.location.href; // Ca, c'est vraiment la page
if (vud_referer.indexOf('viteundevis.com') > 0) {
	// Le script est posé sur viteundevis, donc, on se base sur le referer
	vud_referer = 'https://www.ecolo-bois.org/';
}

vud_debug = false;
if (!window.jQuery) {
	(function () {
		var jq = document.createElement('script'); jq.type = 'text/javascript';
		jq.src = 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(jq, s);

		if (vud_debug) console.log('Jquery loaded');
	})();
}
else
	if (vud_debug) console.log('Jquery already loaded');

function vud_vn(x) {
	var anum = /(^\d+$)|(^\d+.\d+$)/
	if (anum.test(x) && x != 0)
		testresult = true
	else
		testresult = false
	return (testresult)
}

function vud_file(fichier, callback) {
	// Type d'appel


	jQuery.ajax({
		url: fichier,
		xhrFields:
		{
			withCredentials: false
		},
		success: function (html_return) {
			html = html_return;
			callback();
		}

	});
}

vud_ok_jquery_nb_verif = 0;
function vud_active() {
	console.log('Verif jquery ' + vud_ok_jquery_nb_verif);
	vud_ok_jquery = window.jQuery;
	if (vud_ok_jquery) {
		//jQuery.noConflict();
		jQuery(document).ready(function () {
			jQuery("head").append(jQuery(document.createElement("link")).attr({ rel: "stylesheet", type: "text/css", href: "//www.viteundevis.com/mb/v2/css.css" }));
			if (vud_debug) console.log('CSS loaded');
			jQuery("head").append(jQuery(document.createElement("link")).attr({ rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Roboto" }));
			if (vud_debug) console.log('Font loaded');
			jQuery("head").append(jQuery(document.createElement("script")).attr({ type: "text/javascript", src: "//www.viteundevis.com/static/autosize.min.js" }));
			if (vud_debug) console.log('Autosize loaded');
			/*jQuery("head").append(jQuery(document.createElement("script")).attr({type:"text/javascript", src:"//www.viteundevis.com/static/devistap.js"}));
			if(vud_debug) console.log('Devistap loaded');*/
			vud_referer_code = 'default';
			vud_referer_code = jQuery("#v83a7473264d").attr('referer_code');
			if (vud_referer_code === undefined || vud_referer_code == '') {
				vud_referer_code = 'default';
			}
			jQuery("#v83a7473264d").append('<div id="vud_mb_js_box"></div>');
			if (vud_debug) console.log('Div created');
			vud_affiche_devis_cat(133)
			// referer_code
			jQuery("#vud_mb_js_box").append('<img src="//www.viteundevis.com/a.php?pid=812&rc=' + vud_urlencode(vud_referer_code) + '&tc=' + vud_urlencode(collecte_type_id) + '&c=133&f=" alt="" style="width:1px;height:1px" />');
		})
	}
	else {
		vud_ok_jquery_nb_verif++;
		if (vud_ok_jquery_nb_verif < 30) {
			setTimeout(function () { vud_active() }, 300);
		}
	}
}




var devistap_timer;
var devistap_timer_popup;
var nb_pro_timer_popup;
var nb_pro_timer;
var actual_position;
var devistap_data = new Array();
if (typeof devistap_type == 'undefined')
	devistap_type = 'UNK';


function devistap_getpays(texte, etape_id, gps_x, gps_y) {
	vud_file('https://www.viteundevis.com/mb/v2/ajax.php?content=calculette_list_ville&etape_id=' + etape_id + '&gps_x=' + gps_x + '&gps_y=' + gps_y + '&ville=' + vud_urlencode(texte), function () {
		if (html != '') {
			jQuery('#devistap_step1_res').html(html);
			jQuery('#devistap_step1_res').show();
		}
	});
}




function devistap_getpays_travaux_com(texte, etape_id, gps_x, gps_y, cat_id) {
	vud_file('https://www.viteundevis.com/mb/v2/ajax.php?p=812&content=calculette_list_ville&cat_id=' + cat_id + '&travauxcom=1&etape_id=' + etape_id + '&gps_x=' + gps_x + '&gps_y=' + gps_y + '&ville=' + vud_urlencode(texte), function () {
		if (html != '') {
			jQuery('#devistap_step1_res').html(html);
			jQuery('#devistap_step1_res').show();
		}
	});
}

function devistap_maj_progession(etape) {
	a = 0;
	console.log('devistap_maj_progession');
	jQuery('body #vud_mb_js_box #devistap_progression .devistap_progression_point').removeClass('devistap_progression_point_rouge');
	jQuery('body #vud_mb_js_box #devistap_progression .devistap_progression_point').addClass('devistap_progression_point_gris');
	jQuery('body #vud_mb_js_box #devistap_progression .devistap_progression_point').css('animation', 'none');
	jQuery('body #vud_mb_js_box #devistap_progression .devistap_progression_point').each(function () {
		console.log('devistap_maj_progession passage');
		a++;
		if (etape > a) {
			jQuery(this).removeClass('devistap_progression_point_gris');
		}
		else if (etape == a) {
			jQuery(this).removeClass('devistap_progression_point_gris');
			position = jQuery(this).position().left;
			position_2 = jQuery('body #vud_mb_js_box #devistap_progression_content').position().left;
			position = position_2 + position + (jQuery(this).width() / 2);
			jQuery("body #vud_mb_js_box #devistap_progression_barre").animate({
				width: position + 'px',
			}, 350, function () {
				jQuery('body #vud_mb_js_box #devistap_progression_point_' + etape).addClass('devistap_progression_point_rouge');
				jQuery('body #vud_mb_js_box #devistap_progression_point_' + etape).css('animation', 'devistap_deplace_point 1s linear 0s 1 normal');
			});
			//jQuery()
			console.log(position);
		}
	})
}

function devistap_retour_haut() {
	// On regarde si il faut remonter la fenetre pour voir la question en entier
	if (jQuery('#devistap').length <= 0)
		return (false);

	// Position de la box
	box_pos = jQuery('#devistap_progression').offset();
	box_pos_top = box_pos["top"] - 70;

	// Position du scroll
	scroll_top = jQuery(window).scrollTop();

	// Est ce que le haut est visible ?
	if (scroll_top < box_pos_top)
		return (true);

	// Si on est la, c'est que c'est pas bon
	jQuery('html, body').animate(
		{
			scrollTop: box_pos_top
		}, 'slow');

}

function devistap_remove_etap(question_titre) {
	jQuery('#calculette_form_final #hidden_' + question_titre).remove();
}

function devistap_checkbox_valid_etap(selecteur, question_tag, question_type) {
	question_name = 'description_auto[]';
	nb = 0;
	txt = question_type + " : ";
	jQuery(selecteur).each(function (index) {
		if (nb > 0) {
			txt += ' / ';
		}
		txt += jQuery(this).val();
		nb++;
	})
	if (nb > 0) {
		jQuery('#calculette_form_final').append('<input type="hidden" name="' + question_name + '" id="hidden_' + question_tag + '" value="' + vud_htmlentities(txt) + '" />');
	}

}

function devistap_valid_etap(question_titre, question_name, question_value, reponse_id, efface_before) {
	if (question_name == 'etape_id')
		return (true);
	if (efface_before)
		devistap_remove_etap(question_titre);
	if (question_name.indexOf('[') <= 0) {
		jQuery('#calculette_form_final input[name=' + question_name + ']').remove();
	}
	jQuery('#calculette_form_final input[name=' + question_titre + ']').remove();
	jQuery('#calculette_form_final').append('<input type="hidden" name="' + question_name + '" id="hidden_' + question_titre + '" value="' + vud_htmlentities(question_value) + '" />');
	if (vud_vn(reponse_id))
		jQuery('#calculette_form_final').append('<input type="hidden" name="' + question_titre + '" id="hidden_' + question_titre + '_CLEAR" value="' + vud_htmlentities(reponse_id) + '" />');
}

function devistap_next_etape(etape_id) {
	/*if(etape == 'garage_maison')
		devistap_affichage_mode(2);
	else
		devistap_affichage_mode(1);*/

	console.log('On demande l affichage du bloc ' + etape_id);

	// On remonte au haut
	devistap_retour_haut();

	if (!Number.isInteger(etape_id))
		return (false);


	jQuery('#devistap_step' + (etape_id - 1)).css('display', 'none');
	jQuery('#devistap_step' + etape_id).fadeIn('');
	devistap_maj_progession(etape_id);

	// Il existe un suivant ?
	next_etape = etape_id + 1;
	if (jQuery('#devistap_step' + next_etape).length <= 0) {
		// C'est le formulaire
		console.log('Formulaire affiché');
	}
}

function devistap_retour_etap(etape_id) {

	console.log('On demande l affichage du bloc ' + etape_id);

	// On remonte au haut
	devistap_retour_haut();

	if (!Number.isInteger(etape_id))
		return (false);

	/*if(!vn(etape_nb))
		return(false);
		
	if(etape_id > etape_nb)
		return(false);*/


	jQuery('#devistap_step' + (etape_id + 1)).css('display', 'none');
	jQuery('#devistap_step' + etape_id).fadeIn('');
	devistap_maj_progession(etape_id);
}

function devistap_maPosition(position) {
	var infopos = "Position déterminée :\n";
	infopos += "Latitude : " + position.coords.latitude + "\n";
	infopos += "Longitude: " + position.coords.longitude + "\n";
	infopos += "Altitude : " + position.coords.altitude + "\n";
	console.log(position);
	console.log(infopos);
	devistap_cherche_ville('', actual_position, position.coords.longitude, position.coords.latitude);
	jQuery('#devistap_step1_res').removeClass('vud_wait_box');
}

function devistap_maPosition_travauxcom(position) {
	var infopos = "Position déterminée :\n";
	infopos += "Latitude : " + position.coords.latitude + "\n";
	infopos += "Longitude: " + position.coords.longitude + "\n";
	infopos += "Altitude : " + position.coords.altitude + "\n";
	console.log(position);
	console.log(infopos);
	devistap_cherche_ville_travaux_com('', actual_position, position.coords.longitude, position.coords.latitude, cat_id);
	jQuery('#devistap_step1_res').removeClass('vud_wait_box');
	//_gaq.push(['_trackEvent','devistap_event', 'GPS', 1, 0, true]);
}

function devistap_cherche_ville(ville_nom, etape_id, gps_x, gps_y) {
	clearTimeout(devistap_timer);
	clearTimeout(devistap_timer_popup);
	devistap_timer = setTimeout(function () {
		if (ville_nom != '' && ville_nom.length > 2)
			jQuery('#devistap_gps_bouton').fadeOut();
		else
			jQuery('#devistap_gps_bouton').fadeIn();
		devistap_getpays(ville_nom, etape_id, gps_x, gps_y);
		box_pos = jQuery('#devistap_progression').offset();
		box_pos_top = box_pos["top"] - 70;
		if (Number.isInteger(box_pos_top)) {
			jQuery('html, body').animate(
				{
					scrollTop: box_pos_top
				}, 'slow');
		}
	}, 250);
}



function devistap_cherche_ville_travaux_com(ville_nom, etape_id, gps_x, gps_y, cat_id) {
	clearTimeout(devistap_timer);
	clearTimeout(devistap_timer_popup);
	if (!vud_vn(cat_id))
		cat_id = global_cat_id;
	devistap_timer = setTimeout(function () {
		if (ville_nom != '' && ville_nom.length > 2)
			jQuery('#devistap_gps_bouton').fadeOut();
		else
			jQuery('#devistap_gps_bouton').fadeIn();
		devistap_getpays_travaux_com(ville_nom, etape_id, gps_x, gps_y, cat_id);
		box_pos = jQuery('#devistap_progression').offset();
		box_pos_top = box_pos["top"] - 70;
		if (vud_vn(box_pos_top)) {
			jQuery('html, body').animate(
				{
					scrollTop: box_pos_top
				}, 'slow');
		}
	}, 250);
}

function devistap_print() {
	window.print();
}

function devistap_email(e) {
	afficheFileInBox('/ajax/getcontent.php?content=19&titre=' + vud_urlencode(document.title) + '&url=' + vud_urlencode(document.location.href), e, '');
}

devistap_affiche_pro_box_loaded = false;
function devistap_affiche_pro_resize_box() {
	pos_bloc_left = jQuery('#devistap_resultat_devis_left').offset();
	//console.log(pos_bloc_left);
	pos_bloc_right = jQuery('#devistap_resultat_devis_right').offset();
	hauteur_bloc_right = jQuery('#devistap_resultat_devis_right').height();
	largeur_bloc_right = jQuery('#devistap_resultat_devis_right').width();
	largeur_box_devis = (pos_bloc_right["left"] + largeur_bloc_right - pos_bloc_left["left"]);
	jQuery('#devistap_resultat_devis_bloc').css('top', '0px');
	jQuery('#devistap_resultat_devis_bloc').css('left', '0px');
	jQuery('#devistap_resultat_devis_bloc').css('width', largeur_box_devis + 'px');
	if (!devistap_affiche_pro_box_loaded)
		jQuery('#devistap_resultat_devis_bloc').css('height', hauteur_bloc_right + 'px');
	else {
		hauteur_bloc_left = jQuery('#devistap_resultat_devis_bloc').height() + 20;
		jQuery('#devistap_resultat_devis_left').css('height', hauteur_bloc_left + 'px');
	}
}

function devistap_affiche_pro_popup() {
	jQuery('#bouton_ouvrir_popup').click();
}

function devistap_checkbox_reno() {
	ok_checkbox = 0;
	question_titre = 'RENO_OTHER';
	devistap_remove_etap(question_titre);
	jQuery('input[renovation_checkbox=1]:checked').each(function () {
		ok_checkbox++;
		element_name = jQuery(this).attr('name');
		element_valeur = jQuery(this).val();
		devistap_valid_etap(question_titre, element_name, element_valeur, false);
	})

	if (ok_checkbox > 0)
		return (true);
	else
		return (false);
}

function devistap_checkbox_cst() {
	ok_checkbox = 0;
	question_titre = 'CST_TYPE';
	devistap_remove_etap(question_titre);
	jQuery('input[cst_checkbox=1]:checked').each(function () {
		ok_checkbox++;
		element_name = jQuery(this).attr('name');
		element_valeur = jQuery(this).val();
		devistap_valid_etap(question_titre, element_name, element_valeur, false);
	})

	if (ok_checkbox > 0)
		return (true);
	else
		return (false);
}

var vud_anim_timer;
var vud_anim_timer_nb = 0;
function vud_anim_first_step() {
	vud_nb_elem = jQuery('#devistap_step1 .devistap_choix').length;
	jQuery('#devistap_step1 .devistap_choix').mouseover(function () { vud_anim_stop() })
	vud_anim_first_step_anim(1, vud_nb_elem);
	//alert(vud_nb_elem);
}
function vud_anim_stop() {
	jQuery('#devistap_step1 .devistap_choix').removeClass('devistap_choix_hover');
	clearTimeout(vud_anim_timer);
	jQuery('#devistap_step1 .devistap_choix').css('transition', 'none');
}

function vud_anim_first_step_anim(num_elem, max_elem) {

	if (vud_anim_timer_nb >= 6) {
		vud_anim_stop();
		return;
	}
	if (vud_anim_timer_nb == 0 || vud_anim_timer_nb == 2 || vud_anim_timer_nb == 4)
		jQuery('#devistap_step1 .devistap_choix').addClass('devistap_choix_hover');
	else
		jQuery('#devistap_step1 .devistap_choix').removeClass('devistap_choix_hover');

	vud_anim_timer = setTimeout(function () { vud_anim_first_step_anim(num_elem, max_elem) }, 500);
	console.log()
	vud_anim_timer_nb++;
	//alert(num_elem+'/'+max_elem);
}

function vud_affiche_devis_cat(cat_id, on_scroll) {
	vud_file('https://www.viteundevis.com/mb/v2/devis.php?p=812&nh=0&cat_id=' + cat_id + '&referer=&t=', function () {
		jQuery('#vud_mb_js_box').html(html); if (on_scroll) {
			devistap_retour_haut();
		};
		vud_anim_first_step()
	});
	//alert('youhou '+cat_id);
}

function vud_htmlentities(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function vud_urlencode(url) {
	return encodeURIComponent(url);
}

/* 
								<input type="hidden" name="iframe" value="{}" />
								<input type="hidden" name="" value="" />*/
function vud_sendform(formulaire_id, fichier, callback) {
	// ENVOI LES FORMULAIRES EN AJAX AVEC JQUERY ET CALLBACK
	// formulaire : NOM DU DIV
	console.log('vud_sendform launch ok');
	// Construction du post
	post = "";
	if (jQuery("#" + formulaire_id).length <= 0)
		alert('Formulaire introuvable');
	jQuery("#" + formulaire_id + ' :input').each(function () {
		{
			champ = jQuery(this);
			champ_type = champ.attr('type');
			if ((champ_type == "checkbox" || champ_type == "radio") && champ.is(':checked') || (champ_type != "checkbox" && champ_type != "radio"))
				post += vud_urlencode(jQuery(this).attr('name')) + '=' + vud_urlencode(jQuery(this).val()) + '&';
		}
	});

	post += '&iframe=&collecte_type_id=' + collecte_type_id + '&fr=&p=812&partenaire_id=812&referer=' + vud_referer + '&rc=' + vud_urlencode(vud_referer_code);


	// On poste
	jQuery.ajax({
		url: fichier,
		type: 'POST', // Le type de la requête HTTP, ici devenu POST
		data: post, // On fait passer nos variables, exactement comme en GET, au script more_com.php
		dataType: 'html',
		success: function (html_return) {
			html = html_return;
			if (vud_debug) console.log("Devis typeof" + typeof vud_on_devis_sent);
			if (typeof vud_on_devis_sent === "function") {
				vud_on_devis_sent();
			}
			console.log('vud_sendform ends ok');
			callback();
		}

	});
}

function vud_verificationNombre(nombre, sep_ok) {
	// Supprime les lettres dans un texte);
	nombre2 = '';
	if (sep_ok)
		nombre = nombre.replace(',', '.');
	longueur = nombre.length;
	for (a = 0; a < longueur; a++) {
		car = nombre.charAt(a);
		if (vud_vn(car) || car == '0' || (sep_ok && car == '.')) {
			nombre2 += car;
		}
	}
	return (nombre2);
}


console.log('INDEX-PID-812');
vud_active();
