import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import logo from './assets/logo.png';
import horse from './assets/horse.png';

// Dati iniziali per i cavalli e il totalizzatore
const cavalliIniziali = [
  { nome: 'DUCCIO DEGLI DEI', colore: '#28a745' },
  { nome: 'BLACK COFFEE', colore: '#ffc107' },
  { nome: 'BLUE SKY', colore: '#7bed9f' },
  { nome: 'ALEXANDER FAS', colore: '#fd7e14' },
  { nome: 'FEEL GOOD INC. DELLI', colore: '#3f51b5' },
  { nome: 'SCACCO MATTO', colore: '#dc3545' },
  { nome: 'FORREST GUMP', colore: '#6f42c1' },
  { nome: 'VENTO DI SCIROCCO', colore: '#f78fb3' },
  { nome: 'SAETTA', colore: '#f8f9fa' },
  { nome: 'PEGASO', colore: '#ffd700' },
  { nome: 'NERONE', colore: '#343a40' },
  { nome: 'TUONO', colore: '#17a2b8' },
  { nome: 'OMBRA', colore: '#6c757d' },
  { nome: 'VENTO', colore: '#74b9ff' },
  { nome: 'TITANO', colore: '#a0522d' },
  { nome: 'GOLIATH', colore: '#ced4da' },
  { nome: 'LUNA', colore: '#007bff' },
  { nome: 'COMETA', colore: '#6610f2' },
  { nome: 'FENICE', colore: '#e83e8c' },
  { nome: 'ZEFIRO', colore: '#20c997' }
];

const datiTotalizzatore = [
    { pos: 1, nome: 'DUCCIO DEGLI DEI', fantino: 'L. CAMELLINI', record: '9.6.8.5.4.5', quotaVincente: 12.30, quotaMinPiazzato: 2.25, quotaMaxPiazzato: 7.35, stelle: 1, stellaD: true },
    { pos: 2, nome: 'BLACK COFFEE', fantino: 'F. MARTINELLI', record: '5.5.3.1.-3', quotaVincente: 6.15, quotaMinPiazzato: 2.40, quotaMaxPiazzato: 8.02, stelle: 1, stellaD: true },
    { pos: 3, nome: 'BLUE SKY', fantino: 'M. ZARRELLA', record: '-.6.6.8.12.3', quotaVincente: 30.75, quotaMinPiazzato: 4.48, quotaMaxPiazzato: 17.65, stelle: 0, stellaD: true },
    { pos: 4, nome: 'ALEXANDER FAS', fantino: 'C. ESPOSITO', record: '--.12.-.10', quotaVincente: null, quotaMinPiazzato: null, quotaMaxPiazzato: null, stelle: 1, stellaD: false },
    { pos: 5, nome: 'FEEL GOOD INC. DELLI', fantino: 'R. GIANNI', record: '8.4.5.8.11', quotaVincente: null, quotaMinPiazzato: 10.21, quotaMaxPiazzato: 44.14, stelle: 1, stellaD: true },
    { pos: 6, nome: 'SCACCO MATTO', fantino: 'G. ROMANO', record: '5.3.3.7.4.3', quotaVincente: 5.12, quotaMinPiazzato: 2.57, quotaMaxPiazzato: 8.82, stelle: 0, stellaD: true },
    { pos: 7, nome: 'FORREST GUMP', fantino: 'A. BIANCHI', record: '2.1.1.2.1.1', quotaVincente: 3.80, quotaMinPiazzato: 1.80, quotaMaxPiazzato: 3.10, stelle: 2, stellaD: true },
    { pos: 8, nome: 'VENTO DI SCIROCCO', fantino: 'S. RUSSO', record: '10.9.11.8.7.6', quotaVincente: 25.00, quotaMinPiazzato: 5.00, quotaMaxPiazzato: 15.00, stelle: 0, stellaD: false }
];

function App() {
  // Stati principali dell'applicazione
  const [nome, setNome] = useState('MARIO');
  const [cognome, setCognome] = useState('ZARRELLA');
  const [saldo, setSaldo] = useState(4073);
  const [giocata, setGiocata] = useState('');
  const [cavalloSelezionato, setCavalloSelezionato] = useState('SCACCO MATTO');
  const [cavalliGara, setCavalliGara] = useState(cavalliIniziali.slice(0, 8)); // 8 cavalli iniziali
  const [winner, setWinner] = useState('');
  const [esitoDesiderato, setEsitoDesiderato] = useState(null); // null: casuale, true: vittoria, false: sconfitta

  // Stati per la gestione della UI e dei messaggi
  const [erroreInput, setErroreInput] = useState('');
  const [mostraPaginaScommessa, setMostraPaginaScommessa] = useState(true);
  const [mostraMessaggioConferma, setMostraMessaggioConferma] = useState(false);
  const [mostraMessaggioEsito, setMostraMessaggioEsito] = useState(false);
  const [mostraModaleAltro, setMostraModaleAltro] = useState(false);
  const [mostraTotalizzatore, setMostraTotalizzatore] = useState(false);
  const [mostraVincitePiazzati, setMostraVincitePiazzati] = useState(false); // <--- AGGIUNGI QUESTO


  // Stati temporanei per il modale "Altro"
  const [tempNome, setTempNome] = useState('');
  const [tempCognome, setTempCognome] = useState('');
  const [tempSaldo, setTempSaldo] = useState(0);
  const [tempNumeroCavalli, setTempNumeroCavalli] = useState(0);
  const [tempEsito, setTempEsito] = useState('casuale'); // 'si', 'no', 'casuale'

  // Ref per memorizzare la puntata corrente (non scatena re-render)
  const puntataRef = useRef(null);

  // Inizializza la giocata con il saldo all'avvio e ad ogni reset/cambio saldo
  useEffect(() => {
    setGiocata(saldo.toString());
  }, [saldo]);

  // Funzione per eseguire la logica dell'esito della gara
  const eseguiEsito = useCallback(() => {
    let cavalli = [...cavalliGara];

    if (esitoDesiderato === true) {
      // Vittoria forzata del cavallo selezionato
      const cavalloTarget = cavalli.find(c => c.nome === cavalloSelezionato);
      if (cavalloTarget) {
        cavalli = [cavalloTarget, ...cavalli.filter(c => c.nome !== cavalloSelezionato)];
      } else {
        // Fallback se il cavallo selezionato non è più in gara
        cavalli.sort(() => Math.random() - 0.5);
      }
    } else if (esitoDesiderato === false) {
      // Sconfitta forzata del cavallo selezionato
      const cavalloTarget = cavalli.find(c => c.nome === cavalloSelezionato);
      if (cavalloTarget) {
        const altri = cavalli.filter(c => c.nome !== cavalloSelezionato);
        const pos = Math.floor(Math.random() * altri.length) + 1; // Posizione casuale non prima
        altri.splice(pos, 0, cavalloTarget);
        cavalli = altri;
      } else {
        // Fallback
        cavalli.sort(() => Math.random() - 0.5);
      }
    } else {
      // Esito casuale: mescola i cavalli
      cavalli.sort(() => Math.random() - 0.5);
    }

    const vincitore = cavalli[0].nome;
    setWinner(vincitore);
    const haVinto = vincitore === cavalloSelezionato;
    const puntata = puntataRef.current ?? 0;

    if (haVinto) {
      setSaldo(prev => prev + puntata * 2);
    }

    setMostraMessaggioEsito(true);
  }, [cavalliGara, esitoDesiderato, cavalloSelezionato, puntataRef]);

  // Gestisce la scommessa
  const handleScommetti = useCallback(() => {
    const puntata = parseInt(giocata);
    setErroreInput('');

    if (isNaN(puntata) || puntata <= 0) {
      setErroreInput('Inserisci un importo valido.');
      return;
    }
    if (puntata > saldo) {
      setErroreInput('L\'importo non può essere maggiore del tuo saldo.');
      return;
    }

    puntataRef.current = puntata; // Salva la puntata nel ref
    setSaldo(prevSaldo => prevSaldo - puntata); // Aggiorna il saldo
    setMostraMessaggioConferma(true); // Mostra il messaggio di conferma
  }, [giocata, saldo]);

  // Chiude il messaggio di conferma e avvia la gara
  const handleChiudiMessaggio = useCallback(() => {
    setMostraPaginaScommessa(false);
    setMostraMessaggioConferma(false);
    eseguiEsito(); // Avvia la logica dell'esito
  }, [eseguiEsito]);

  // Prepara l'interfaccia per una nuova scommessa
  const handleScommettiDiNuovo = useCallback(() => {
    setMostraPaginaScommessa(true);
    setMostraMessaggioEsito(false);
    setErroreInput(''); // Pulisce eventuali errori precedenti
    setGiocata(saldo.toString()); // Pre-popola la giocata con il saldo attuale
  }, [saldo]);

  // Reimposta il gioco allo stato iniziale
  const handleReset = useCallback(() => {
    setSaldo(4073);
    setNome('MARIO');
    setCognome('ZARRELLA');
    setGiocata('4073');
    setCavalloSelezionato('SCACCO MATTO');
    setWinner('');
    setMostraPaginaScommessa(true);
    setMostraMessaggioConferma(false);
    setMostraMessaggioEsito(false);
    setErroreInput('');
    puntataRef.current = null; // Resetta la puntata nel ref
    setEsitoDesiderato(null);
    setCavalliGara(cavalliIniziali.slice(0, 8));
    setMostraTotalizzatore(false);
  }, []);

  // Prepara i valori per il modale "Altro" e lo mostra
  const handleAltro = useCallback(() => {
    setTempNome(nome);
    setTempCognome(cognome);
    setTempSaldo(saldo);
    setTempNumeroCavalli(cavalliGara.length);
    setTempEsito(esitoDesiderato === null ? 'casuale' : esitoDesiderato ? 'si' : 'no');
    setMostraModaleAltro(true);
  }, [nome, cognome, saldo, cavalliGara.length, esitoDesiderato]);

  // Applica le impostazioni dal modale "Altro"
  const confermaModaleAltro = useCallback(() => {
    setNome(tempNome.toUpperCase());
    setCognome(tempCognome.toUpperCase());
    setSaldo(Number(tempSaldo));
    setGiocata(Number(tempSaldo).toString()); // Assicura che la giocata sia inizializzata con il nuovo saldo
    setCavalliGara(cavalliIniziali.slice(0, Number(tempNumeroCavalli)));
    setErroreInput('');

    if (tempEsito === 'si') setEsitoDesiderato(true);
    else if (tempEsito === 'no') setEsitoDesiderato(false);
    else setEsitoDesiderato(null);

    setMostraModaleAltro(false);
  }, [tempNome, tempCognome, tempSaldo, tempNumeroCavalli, tempEsito]);


  const handleToggleTotalizzatore = useCallback((event) => {
      event.preventDefault();
      setMostraTotalizzatore(prev => !prev);
      // Opzionale: se vuoi che solo uno dei due sia aperto alla volta, chiudi l'altro
      if (mostraVincitePiazzati) { // <--- OPZIONALE: chiude l'altro se aperto
        setMostraVincitePiazzati(false);
      }
    }, [mostraVincitePiazzati]); // Aggiungi mostraVincitePiazzati alle dipendenze se usi l'opzione

    // Nuova funzione per toggle la visibilità delle vincite/piazzati
    const handleToggleVincitePiazzati = useCallback((event) => { // <--- AGGIUNGI QUESTO
      event.preventDefault();
      setMostraVincitePiazzati(prev => !prev);
      // Opzionale: se vuoi che solo uno dei due sia aperto alla volta, chiudi l'altro
      if (mostraTotalizzatore) { // <--- OPZIONALE: chiude l'altro se aperto
        setMostraTotalizzatore(false);
      }
    }, [mostraTotalizzatore]); // Aggiungi mostraTotalizzatore alle dipendenze se usi l'opzione


  // Gestione degli eventi della tastiera (Enter, Spacebar, R)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prioritizza la chiusura del modale di conferma
      if (mostraMessaggioConferma) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleChiudiMessaggio();
        }
        return;
      }

      // Gestisce il tasto 'R' per il reset (case-insensitive)
      // Solo se l'elemento attivo NON è un input o una textarea
      if ((e.key === 'r' || e.key === 'R') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleReset();
        return;
      }


      // Nuova scorciatoia da tastiera per Vincite/Piazzati (es. tasto 'V')
      if ((e.key === 'v' || e.key === 'V') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') { // <--- OPZIONALE: scorciatoia tastiera 'V'
        e.preventDefault();
        handleToggleVincitePiazzati(e); // Passa l'evento
        return;
      }

           if ((e.key === 't' || e.key === 'T') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
             e.preventDefault(); // Previene il comportamento predefinito del browser per il tasto 'T'
             handleToggleTotalizzatore(e); // <--- MODIFICA QUI: PASSA L'OGGETTO EVENTO 'e'
             return;
           }

      // Gestisce le interazioni generali di gioco (Enter/Space)
      // Solo se l'elemento attivo NON è un input o una textarea
      if ((e.key === 'Enter' || e.key === ' ') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        if (e.key === ' ') {
          e.preventDefault();
        }

        if (mostraPaginaScommessa) {
          handleScommetti();
        } else if (mostraMessaggioEsito) {
          handleScommettiDiNuovo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    handleScommetti,
    handleChiudiMessaggio,
    handleScommettiDiNuovo,
    handleReset,
    handleToggleTotalizzatore,
    handleToggleVincitePiazzati,
    mostraPaginaScommessa,
    mostraMessaggioConferma,
    mostraMessaggioEsito
  ]);

  // Componente per renderizzare le card dei cavalli
  const renderCavalli = useCallback(() => {
    return (
      <div className="cavalli">
        {cavalliGara.map((cavallo, i) => (
          <div
            key={cavallo.nome} // Usa il nome del cavallo come key per stabilità
            className="cavallo-card"
            onClick={() => setCavalloSelezionato(cavallo.nome)}
            style={{ border: cavalloSelezionato === cavallo.nome ? '3px solid orange' : 'none' }}
          >
            <img src={horse} alt={`Cavallo ${cavallo.nome}`} style={{ width: '40px', height: '40px' }} />
            <div className="barra" style={{ backgroundColor: cavallo.colore }}></div>
            <div className="nome-cavallo">{cavallo.nome}</div>
          </div>
        ))}
      </div>
    );
  }, [cavalliGara, cavalloSelezionato]); // Dipendenze per useCallback

 // Componente per renderizzare totalizzatore
   const renderTotalizzatore = useCallback(() => {
       if (!mostraTotalizzatore) return null;

       return (
           <div className="totalizzatore-list-container">
               <div className="totalizzatore-table">
                                      <div className="vincite-piazzati-header-row">
                                          <div className="vincite-piazzati-header-col"></div> {/* Posizione/Trend */}
                                          <div className="vincite-piazzati-header-col"></div> {/* Nome Cavallo/Fantino */}
                                          <div className="vincite-piazzati-header-col"></div> {/* Icona Lista */}
                                          <div className="vincite-piazzati-header-col">Vincente</div>
                                          <div className="vincite-piazzati-header-col">Piazzato 1-2</div>
                                      </div>
                   {datiTotalizzatore.map((dati) => (
                       <div className="totalizzatore-row" key={dati.pos}>
                           <div className="totalizzatore-col totalizzatore-pos">
                               <span className="pos-number">{dati.pos}</span>

                           </div>
                           <div className="totalizzatore-col totalizzatore-info">
                               <div className="nome-cavallo-totalizzatore">{dati.nome}</div>
                               <div className="fantino-record">
                                   {dati.fantino} <span className="record">{dati.record}</span>
                               </div>
                               <div className="stelle-form-stellaD">
                                   {Array.from({ length: dati.stelle }).map((_, i) => (
                                       <span key={`star-${dati.pos}-${i}`} className="star-icon">⭐</span>
                                   ))}

                                   {dati.stellaD && <span className="star-d-icon">⭐</span>} {/* Icona per stella D */}
                               </div>
                           </div>
                           <div className="totalizzatore-col totalizzatore-quote-vincita">
                               <span className="quota-valore">{dati.quotaVincente !== null ? dati.quotaVincente.toFixed(2) : '-'}</span>
                           </div>
                           <div className="totalizzatore-col totalizzatore-quote-piazzato">
                               <span className="min-max-quota">
                                   min {dati.quotaMinPiazzato !== null ? dati.quotaMinPiazzato.toFixed(2) : '-'} <br/>
                                   max {dati.quotaMaxPiazzato !== null ? dati.quotaMaxPiazzato.toFixed(2) : '-'}
                               </span>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
       );
   }, [mostraTotalizzatore]); // Dipende solo dalla visibilità

// Crea una funzione per renderizzare il contenuto Vincite/Piazzati
  const renderVincitePiazzati = useCallback(() => {
    if (!mostraVincitePiazzati) return null;

    return (
       <div className="vincite-piazzati-list-container">
                   <div className="vincite-piazzati-table">
                       {/* Header della tabella */}
                       <div className="vincite-piazzati-header-row">
                           <div className="vincite-piazzati-header-col"></div> {/* Posizione/Trend */}
                           <div className="vincite-piazzati-header-col"></div> {/* Nome Cavallo/Fantino */}
                           <div className="vincite-piazzati-header-col"></div> {/* Icona Lista */}
                           <div className="vincite-piazzati-header-col">Vincente</div>
                           <div className="vincite-piazzati-header-col">Piazzato 1-2</div>
                           <div className="vincite-piazzati-header-col">Piazzato 1-3</div>
                       </div>

                       {/* Righe dei dati */}
                       {datiTotalizzatore.map((dati) => {
                           const hasPiazzatoQuota = dati.quotaMinPiazzato !== null || dati.quotaMaxPiazzato !== null;
                           const hasVincenteQuota = dati.quotaVincente !== null;

                           return (
                               <div className="vincite-piazzati-row" key={dati.pos}>


                                   {/* Colonna Posizione e Info (Numero + Trend) */}
                                   <div className="vincite-piazzati-col vincite-piazzati-pos-info">
                                       <span className="vincite-piazzati-pos-number">{dati.pos}</span>

                                   </div>

                                   {/* Colonna Nome Cavallo e Fantino */}
                                   <div className="vincite-piazzati-col vincite-piazzati-nome-fantino">
                                       <div className="nome-cavallo-vincite">{dati.nome}</div>
                                       <div className="fantino-vincite">{dati.fantino}</div>
                                   </div>



                                   {/* Colonna Quota Vincente */}
                                   <div className={`vincite-piazzati-col vincite-col-quota ${hasVincenteQuota ? 'green-corner-triangle' : ''}`}>
                                       {dati.quotaVincente !== null ? dati.quotaVincente.toFixed(2) : '-'}
                                   </div>

                                   {/* Colonna Quota Piazzato 1-2 */}
                                   <div className={`vincite-piazzati-col vincite-col-quota ${hasPiazzatoQuota ? 'green-corner-triangle' : ''}`}>
                                       {dati.quotaMinPiazzato !== null ? dati.quotaMinPiazzato.toFixed(2) : '-'}
                                   </div>

                                   {/* Colonna Quota Piazzato 1-3 */}
                                   <div className={`vincite-piazzati-col vincite-col-quota ${hasPiazzatoQuota ? 'green-corner-triangle' : ''}`}>
                                       {dati.quotaMaxPiazzato !== null ? dati.quotaMaxPiazzato.toFixed(2) : '-'}
                                   </div>
                               </div>
                           );
                       })}
                   </div>
               </div>
    );
  }, [mostraVincitePiazzati]); // Dipende dalla visibilità

   return (
      <div>
        <header>
          {/* Contenitore principale del logo */}
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>

          {/* Header Band - Dati della gara */}
          <div className="header-band">
            <div className="left-section">
              <div className="flag"></div>
              <div className="text">ITALIA - <strong>SIRACUSA</strong></div>
            </div>
            <div className="text gara-status-group">
             Corsa n° <span className="bold"> 7</span> <span className="gara-in-corso">Attiva</span>
            </div>
            <div className="icon"></div>
          </div>

          {/* Sezione Bottoni Inferiore (Vincite/Piazzato e Totalizzatore) */}
          <div className="bottom-section-row">
           <button className="vincite-piazzato-button" onClick={handleToggleVincitePiazzati}>
              <span className="label">Vincita:</span> <span className="value">1-2</span><br/>
              <span className="label">Piazzato:</span> <span className="value">1-3</span>
            </button>
            <button className="totalizzatore-button" onClick={handleToggleTotalizzatore}>
              Totalizzatore
            </button>
          </div>


          {/* QUI Vanno le chiamate ai componenti per renderizzare totalizzatore e vincite/piazzati, se visibili */}
          {renderTotalizzatore()}
          {renderVincitePiazzati()} {/* <--- DEVE ESSERE QUI */}
        </header>

        {/* Il resto del contenuto della pagina, che mostra la pagina di scommessa */}
        {mostraPaginaScommessa && (
          <>
               <p className="benvenuto">
                 Benvenuto <span className="highlight"><strong>{nome} {cognome}</strong></span><br />
                 Il tuo saldo attuale è: <span className="saldo"><strong>{saldo}€</strong></span><br />
                 <span className="sottotesto">
                   Inizia a scommettere...
                 </span>
               </p>


            {renderCavalli()} {/* Chiamata al componente per renderizzare le card */}

            <div className="giocata">
              <div className="giocata-input-wrapper">
                <h2 className="giocata-titolo">Quanto vuoi puntare: €</h2>
                <input
                  type="number"
                  className="input-importo"
                  placeholder="Inserisci Quota"
                  value={giocata}
                  onChange={(e) => setGiocata(e.target.value)}
                  disabled={mostraMessaggioConferma}
                  min="1"
                  max={saldo}
                />
              </div>
              {erroreInput && <div className="errore-input" style={{ color:'red', marginTop:'5px' }}>{erroreInput}</div>}

              <div className="bottoni-colonna">
                <button className="btn-blu" onClick={handleScommetti} disabled={mostraMessaggioConferma}>Scommetti</button>
              </div>


                 <div className="totalizzatore-table">
                     {datiTotalizzatore.map((dati) => (
                         <div className="totalizzatore-row" key={dati.pos}>
                             <div className="totalizzatore-col totalizzatore-pos">
                                 <span className="pos-number">{dati.pos}</span>

                             </div>
                             <div className="totalizzatore-col totalizzatore-info">
                                 <div className="nome-cavallo-totalizzatore">{dati.nome}</div>
                                 <div className="fantino-record">
                                     {dati.fantino} <span className="record">{dati.record}</span>
                                 </div>
                                 <div className="stelle-form-stellaD">
                                     {Array.from({ length: dati.stelle }).map((_, i) => (
                                         <span key={`star-${dati.pos}-${i}`} className="star-icon">⭐</span>
                                     ))}

                                     {dati.stellaD && <span className="star-d-icon">⭐</span>} {/* Icona per stella D */}
                                 </div>
                             </div>
                             <div className="totalizzatore-col totalizzatore-quote-vincita">
                                 <span className="quota-valore">{dati.quotaVincente !== null ? dati.quotaVincente.toFixed(2) : '-'}</span>
                             </div>
                             <div className="totalizzatore-col totalizzatore-quote-piazzato">
                                 <span className="min-max-quota">
                                     min {dati.quotaMinPiazzato !== null ? dati.quotaMinPiazzato.toFixed(2) : '-'} <br/>
                                     max {dati.quotaMaxPiazzato !== null ? dati.quotaMaxPiazzato.toFixed(2) : '-'}
                                 </span>
                             </div>
                         </div>
                     ))}
                 </div>



              <div className="bottoni-riga">
                <button className="btn-reset" onClick={handleReset} disabled={mostraMessaggioConferma}>Reset</button>
                <button className="altro-btn" onClick={handleAltro} disabled={mostraMessaggioConferma}>Altro</button>
              </div>

            {/* Modale "Altro" */}
            {mostraModaleAltro && (
              <div className="messaggio-conferma"> {/* Riutilizzato lo stile del messaggio di conferma */}
                <div className="contenuto-messaggio">
                  <h2>Impostazioni Giocatore</h2>

                  <div>
                    <label>Nome: </label>
                    <input type="text" className="input-importo" value={tempNome} onChange={(e) => setTempNome(e.target.value)} />
                  </div>
                  <div>
                    <label>Cognome: </label>
                    <input type="text" className="input-importo" value={tempCognome} onChange={(e) => setTempCognome(e.target.value)} />
                  </div>
                  <div>
                    <label>Saldo iniziale:</label>
                    <input type="number" className="input-importo" value={tempSaldo} onChange={(e) => setTempSaldo(Number(e.target.value))} />
                  </div>

                  <label>Numero cavalli in gara:</label>
                  <div>
                    {[8, 12, 16, 18, 20].map(n => (
                      <label key={n} style={{ marginRight: '10px' }}>
                        <input
                          type="radio"
                          name="numeroCavalli"
                          value={n}
                          checked={Number(tempNumeroCavalli) === n}
                          onChange={() => setTempNumeroCavalli(n)}
                        /> {n}
                      </label>
                    ))}
                  </div>

                  <label>SCACCO MATTO deve vincere?</label>
                  <div>
                    {['si', 'no', 'casuale'].map(val => (
                      <label key={val} style={{ marginRight: '10px' }}>
                        <input
                          type="radio"
                          name="esitoScacco"
                          value={val}
                          checked={tempEsito === val}
                          onChange={() => setTempEsito(val)}
                        /> {val}
                      </label>
                    ))}
                  </div>

                  <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <button className="btn-verde" onClick={confermaModaleAltro}>Conferma</button>
                    <button className="btn-reset" onClick={() => setMostraModaleAltro(false)}>Annulla</button>
                  </div>
                </div>
              </div>
            )}

            {/* Messaggio di conferma scommessa */}
            {mostraMessaggioConferma && (
              <div className="messaggio-conferma">
                <div className="contenuto-messaggio">
                  <span className="titolo-messaggio">Complimenti {nome}!</span>
                  <p>
                    La tua scommessa è stata registrata correttamente.<br />
                    Hai scommesso sul cavallo <span>{cavalloSelezionato}</span> <br />
                    alla cifra di <span>{puntataRef.current}€</span>.<br /><br />
                    <span>EQUISPRINT8</span> ti invita a ricordare di giocare responsabilmente.
                  </p>
                  <div className="contenitore-bottone">
                    <button
                      className="btn-chiudi"
                      onClick={handleChiudiMessaggio}
                      >Chiudi
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Messaggio di esito gara */}
      {mostraMessaggioEsito && (
        <div className="esito-container">
          <span className="titolo-span-esito"><strong>
            {winner === cavalloSelezionato ? `COMPLIMENTI ${nome}!` : `HAI PERSO TUTTO ${nome}`}
          </strong></span>

          <p className="messaggio-esito">
            {winner === cavalloSelezionato ? (
              <>Hai vinto <span className="messaggio-esito-testo">{puntataRef.current * 2}€</span> scommettendo su <span className="messaggio-esito-testo">{cavalloSelezionato}</span>.</>
            ) : (
              <>Hai perso <span className="messaggio-esito-testo">{puntataRef.current}€</span> scommettendo su <span className="messaggio-esito-testo">{cavalloSelezionato}</span>.</>
            )}
            <br />
            Il vincitore è: <span className="messaggio-esito-testo">{winner}</span>
          </p>

          <button className="btn-blu" onClick={handleScommettiDiNuovo}>Scommetti di nuovo</button>
        </div>
      )}
    </div>
  );
}

export default App;
