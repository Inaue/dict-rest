const api_url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

let current_page = $('#pag_ini')

const muda_pag = (e =>
{
    current_page.hide()
    current_page = e
    current_page.show()
})

$('input').val('')
$('#btn_ini').on('click', () => muda_pag($('#pag_ini')))
$('#btn_search').on('click', () =>
{
    const word = $('#word_search').val()

    if(word != '')
    {
        $.get(api_url + word)
        .done(mostra_resultado)
        .fail(mostra_erro)
    }
})

$('#btn_search_again').on('click', () =>
{
    const word = $('#word_search_again').val()

    if(word != '')
    {
        $.get(api_url + word)
        .done(mostra_resultado)
        .fail(mostra_erro)
    }
})

const mostra_resultado = res =>
{
    let pronuncia
    let significado
    let palavra

    $('.palavra').remove()
    muda_pag($('#pag_res'))

    res.forEach((w, p) =>
        {
            $('#pag_res').append($('<div class="palavra" id="palavra' + p + '"></div>')[0])
            palavra = $('#palavra' + p)
            palavra.append('<h1>' + w.word + '</h1>')
            palavra.append($('<article id="fonetica' + p + '"></article>')[0])
            palavra.append($('<article id="significados' + p + '"></article>')[0])

            $('#fonetica' + p).append('<h2>Pronúncias</h2>')

            w.phonetics.forEach(ph =>
                {
                    pronuncia = '<hr>' + ph.text

                    if(ph.audio == '')
                    {
                        pronuncia += ' Sem áudio disponível!<br>'
                    }
                    else
                    {
                        pronuncia += '<audio controls>'
                        pronuncia += '<source src="' + ph.audio + '" type="audio/mpeg">'
                        pronuncia += 'ERRO: seu navegador não suporta o áudio!'
                        pronuncia += '</audio><br>'
                    }

                    $('#fonetica' + p).append(pronuncia)
                })
            
            w.meanings.forEach(m =>
                {
                    significado = '<hr><h3>' + m.partOfSpeech + '</h3>'
                    m.definitions.forEach((d, i) =>
                        {
                            significado += String(i + 1) + '. ' + d.definition + '<br>'
                    
                            if('example' in d)
                            {
                                significado += 'Exemplo: ' + d.example + '<br>'
                            }
                        })
                    
                    if(m.synonyms.length != 0)
                    {
                        significado += 'Sinônimos: ' + m.synonyms.join(', ') + '<br>'
                    }

                    if(m.antonyms.length != 0)
                    {
                        significado += 'Antônimos: ' + m.antonyms.join(', ') + '<br>'
                    }
                    
                    $('#significados' + p).append(significado)
                })
        })
}

const mostra_erro = res =>
{
    alert('ERRO: busca mal sucedida! Tente novamente.')
}