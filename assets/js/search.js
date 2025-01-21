import Fuse from 'fuse.js'

const fuseOptions = {
  includeScore: true,
  threshold: 0.4,
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'summary', weight: 0.5 },
    { name: 'tags', weight: 0.3 },
    { name: 'categories', weight: 0.3 },
    { name: 'permalink', weight: 0.5 }
  ]
}

function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

async function initSearch() {
  const searchInput = document.getElementById("search-input")
  const searchItems = document.getElementsByName('search-item')
  const collapse = document.getElementById('search-collapse')
  
  const searchData = await fetch('/index.json').then(res => res.json())
  const fuse = new Fuse(searchData, fuseOptions)

  searchItems.forEach(item => {
    item.addEventListener('change', (e) => {
      if (e.target.id !== 'inner-search') {
        collapse.classList.remove('collapse-open')
        collapse.classList.add('collapse-close')
      } else if (searchInput.value.trim()) {
        displayResults(fuse.search(searchInput.value.trim()))
      }
    })
  })

  const debouncedSearch = debounce((query, searchType) => {
    if (!query) {
      const collapse = document.getElementById('search-collapse')
      collapse.classList.remove('collapse-open')
      collapse.classList.add('collapse-close')
      return
    }
    
    if (searchType === 'inner-search') {
      displayResults(fuse.search(query))
    }
  }, 300)

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim()
    const selectedSearch = Array.from(searchItems).find(item => item.checked)
    debouncedSearch(query, selectedSearch.id)
  })

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim()
      if (!query) return
      
      const selectedSearch = Array.from(searchItems).find(item => item.checked)
      
      if (selectedSearch.id === 'inner-search') {
        displayResults(fuse.search(query))
      } else {
        window.open(selectedSearch.value.replace(/%s/g, encodeURIComponent(query)), '_blank')
      }
    }
  })
}

function displayResults(results) {
  const collapse = document.getElementById('search-collapse');
  const content = collapse.querySelector('.collapse-content');
  content.innerHTML = '';
  
  if (!results.length) {
    content.innerHTML = `<a class="menu-title text-center pt-2">未找到相关结果</a>`
    collapse.classList.remove('collapse-close')
    collapse.classList.add('collapse-open')
    return
  }

  const internalResults = results.filter(r => r.item.internal)
  const externalResults = results.filter(r => !r.item.internal)

  if (internalResults.length) {
    const span = document.createElement('span')
    span.classList.add('menu-title')
    span.textContent = '站内文章'
    content.appendChild(span)

    const internal = document.createElement('div')
    internal.classList.add('p-4', 'overflow-scroll', 'flex', 'flex-wrap', 'gap-3', 'max-h-48')
    internal.appendChild(createSection(internalResults, false))
    content.appendChild(internal)
  }
  
  if (externalResults.length) {
    const span = document.createElement('span')
    span.classList.add('menu-title')
    span.textContent = '网址导航'
    content.appendChild(span)

    const external = document.createElement('div')
    external.classList.add('p-2', 'pb-0', 'overflow-scroll', 'flex', 'flex-wrap', 'gap-3', 'max-h-48')
    external.appendChild(createSection(externalResults, true))
    content.appendChild(external)
  }

  collapse.classList.remove('collapse-close')
  collapse.classList.add('collapse-open')
}

function createSection(results, isExternal) {
  const section = document.createDocumentFragment()
  results.forEach(({ item }) => {
    const a = document.createElement('a')
    a.href = item.permalink
    a.target = isExternal ? '_blank' : '_self'
    a.classList.add('btn', 'btn-ghost')
    a.innerHTML = `
      ${item.favicon}
      <p class="grow text-sm">${item.title}</p>
    </a>
    `
    section.appendChild(a)
  })
  
  return section
}

initSearch()