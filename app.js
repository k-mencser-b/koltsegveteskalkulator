
//KÖTSÉVETÉS VEZÉRLŐ
var koltsegvetesVezerlo = (function() {

  var Kiadas = function(id, leiras, ertek) {
    this.id = id;
    this.leiras = leiras;
    this.ertek = ertek;
  }

  var Bevetel = function(id, leiras, ertek) {
    this.id = id;
    this.leiras = leiras;
    this.ertek = ertek;
  }

  var vegosszegSzamolás = function(tipus) {

    var osszeg = 0;

    adat.tetelek[tipus].forEach(function(akt) {
      osszeg += akt.ertek;
      adat.osszegek[tipus] = osszeg;
    })
  }

  var adat = {
    tetelek: {
      bev: [],
      kia: []
    },
    osszegek: {
      bev: 0,
      kia: 0
    },
    koltsegvetes: 0,
    szazalek: -1
  }

  return {
    tetelHozzaad: function(tip, lei, ert) {
      var ujTetel, ID;
      ID = 0;

      // ID létrehozása
      if (adat.tetelek[tip].length > 0) {
        ID = adat.tetelek[tip][adat.tetelek[tip].length -1].id +1;
      } else {
        ID = 0;
      }
      

      // új kiadás v. bevétel létrehozás
      if(tip === 'bev') {
        ujTetel = new Bevetel(ID, lei, ert);
      } else if(tip === 'kia') {
        ujTetel = new Kiadas(ID, lei, ert);
      }

      //új tétel hozzáadasa adatszerkezethez
      adat.tetelek[tip].push(ujTetel);

      // új tétel visszaadása
      return ujTetel;
    },

    tetelTorol: function(tipus, id) {
      //1,2,8,9,11,12,13
      var idTomb, index;
      idTomb = adat.tetelek[tipus].map(function(aktualis) {
        return aktualis.id;
      });
      index = idTomb.indexOf(id);

      if (index !== -1) {
        adat.tetelek[tipus].splice(index, 1);
      }
    },

    koltsegvetesSzamolas: function() {
     
       //összbev, összkia számolás
       vegosszegSzamolás('bev');
       vegosszegSzamolás('kia');

       //ktgvetés kiszamolása
       adat.koltsegvetes = adat.osszegek.bev - adat.osszegek.kia;

       //százalék számolás
       if (adat.osszegek.bev > 0) {
        adat.szazalek = Math.round((adat.osszegek.kia / adat.osszegek.bev) * 100);

       }else {
        adat.szazalek = -1;
       }
       
    },

    getKoltsegvetes: function() {
      return {
        koltsegvetes: adat.koltsegvetes,
        osszBevetel: adat.osszegek.bev,
        osszKiadas: adat.osszegek.kia,
        szazalek: adat.szazalek
      }
    },

    teszt: function(){
      console.log(adat);
    }
  }

})();


//FELÜLET VEZÉRLŐ
var feluletVezerlo = (function() {

  var DOMelemek = {
    inputTipus: '.hozzaad__tipus',
    inputLeiras: '.hozzaad__leiras',
    inputErtek: '.hozzaad__ertek',
    inputGomb: '.hozzaad__gomb',
    bevetelTarolo: '.bevetelek__lista',
    kiadasTarolo: '.kiadasok__lista',
    koltsegvetesCimke: '.koltsegvetes__ertek',
    osszbevetelCimke: '.koltsegvetes__bevetelek--ertek',
    osszkiadasCimke: '.koltsegvetes__kiadasok--ertek',
    szazalekCimke: '.koltsegvetes__kiadasok--szazalek',
    kontener: '.kontener'
  };

  return {
    // perseFloat(), parseInt()
    getInput: function() {
      return {
        tipus: document.querySelector(DOMelemek.inputTipus).value,
        leiras: document.querySelector(DOMelemek.inputLeiras).value,
        ertek: parseInt(document.querySelector(DOMelemek.inputErtek).value)
      }
     
    },

    getDOMelemek: function() {
      return DOMelemek;
    },

    tetelMegjelenites: function(obj, tipus) {
      var html, ujHtml, elem;

      // HTML megirasa

      if (tipus === 'bev') {
      elem = DOMelemek.bevetelTarolo;

      html = '<div class="tetel clearfix" id="bev-%id%"><div class="tetel__leiras">%leiras%</div><div class="right clearfix><div class="tetel__ertek">%ertek%</div><div class="tetel__torol"><button class="tetel__torol--gomb><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (tipus === 'kia') {
      elem = DOMelemek.kiadasTarolo;

      html = '<div class="tetel clearfix" id="kia-%id%"><div class="tetel__leiras">%leiras%</div><div class="right clearfix><div class="tetel__ertek">%ertek%</div><div class="tetel__szazalek">21%</div><div class="tetel__torol"><button class="tetel__torol--gomb><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // HTML feltöltése adatokkal

      ujHtml = html.replace('%id%', obj.id);
      ujHtml = ujHtml.replace('%leiras%', obj.leiras);
      ujHtml = ujHtml.replace('%ertek%', obj.ertek);

      // Html megjelenítése, hozzáadása DOM-hoz
      //insertAdjacentHTML
      document.querySelector(elem).insertAdjacentHTML('beforeend', ujHtml);
    },

  urlapTorles: function() {
    var mezok, mezokTomb;

    mezok = document.querySelectorAll(DOMelemek.inputLeiras + ',' + DOMelemek.inputErtek);
    mezokTomb = Array.prototype.slice.call(mezok);

    mezokTomb.forEach(function(currentValue, index, array) {
      currentValue.value = '';
    });
    mezokTomb[0].focus();
  }, 

  koltsegvetesMegjelenites: function(obj) {
    document.querySelector(DOMelemek.koltsegvetesCimke).textContent = obj.koltsegvetes;
    document.querySelector(DOMelemek.osszbevetelCimke).textContent = obj.osszBevetel;
    document.querySelector(DOMelemek.osszkiadasCimke).textContent = obj.osszKiadas;
   
   if (obj.szazalek > 0) {
    document.querySelector(DOMelemek.szazalekCimke).textContent = obj.szazalek + '%';
  } else {
    document.querySelector(DOMelemek.szazalekCimke).textContent = '-'
  }
  }
  }

})();

//ALKALMAZÁS VERÉRLŐ
var vezerlo = (function(koltsegvetesVez, feluletVez){

  var esemenykezelokBeallit = function() {
  
    var DOM = feluletVezerlo.getDOMelemek();

    document.querySelector(DOM.inputGomb).addEventListener('click', vezTetelHozzaadas);

      document.addEventListener('keydown', function(event) {

        if(event.key !== undefined && event.key === 'Enter') {
          vezTetelHozzaadas();
        }
        else if(event.keyCode !== undefined && event.keyCode === 13) {
          vezTetelHozzaadas();
        }
      });

      document.querySelector(DOM.kontener).addEventListener('click', vezTetelTorles);
  }


  var osszegFrissitese = function() {

    //1. költségvetés újraszámolása
    koltsegvetesVezerlo.koltsegvetesSzamolas();

    //2. összeg visszaadása
    var koltsegvetes = koltsegvetesVezerlo.getKoltsegvetes();

    //3. összeg megjelenítése a felületen
    feluletVezerlo.koltsegvetesMegjelenites(koltsegvetes);
    

  }
  
  var vezTetelHozzaadas = function() {

    var input, ujTetel;

    //1. bevitt adatok megszerzése
    input = feluletVezerlo.getInput();
    
    if (input.leiras !== '' && !isNaN(input.ertek) && input.ertek > 0) {
        //2. adatok átadása a kőtségvezérlő modulnak
        ujTetel = koltsegvetesVezerlo.tetelHozzaad(input.tipus, input.leiras, input.ertek);

        //3. megjelenítés a UI-n
        feluletVezerlo.tetelMegjelenites(ujTetel, input.tipus);
 
        //4. mezők törlése
        feluletVezerlo.urlapTorles();

        //5. költsévetés újraszámolása és frissítése a felületen
        osszegFrissitese();
    }
   
  };

  var vezTetelTorles = function(event) {
    
    var tetelID, splitID, tipus, ID;
    tetelID = event.target.parentNode.parentNode.parentNode.parentNode.id;  //lehet elég 3 parentNode
    //console.log(tetelID);
    if(tetelID) {
      //bev-0
      splitID = tetelID.split('-');
      tipus = splitID[0];
      ID = parseInt(splitID[1]);
    }

    // 1. tétel törlése
    koltsegvetesVezerlo.tetelTorol(tipus, ID);

    // 2. tétel törlése s felületről

    // 3. összegek újraszámolása és megjelenítése a felületen

  };
  

    return {
      init: function() {
        console.log('alkalmazas fut');
        feluletVezerlo.koltsegvetesMegjelenites( {
          koltsegvetes: 0,
          osszBevetel: 0,
          osszKiadas: 0,
          szazalek: -1
        });
        esemenykezelokBeallit();
      }
    }
  



})(koltsegvetesVezerlo, feluletVezerlo);

vezerlo.init();

/*
-eseménykezelő
-tétel törlése a felületről
-költségvetés újraszámolása
-felületre visszaírjuk az újra számolt értékeket
*/