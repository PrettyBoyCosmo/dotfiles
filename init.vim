" (neo)vim configurations
" created by : cosmo

" configurations
:set number
:set relativenumber
:set autoindent
:set tabstop=4
:set shiftwidth=4
:set smarttab
:set softtabstop=4
:set mouse=a
:set completeopt-=preview
:set encoding=UTF-8
:colorscheme default

" plugins
call plug#begin()
Plug 'https://github.com/vim-airline/vim-airline' " status bar
Plug 'https://github.com/neoclide/coc.nvim'  " auto completion
Plug 'https://github.com/tpope/vim-commentary' " commenting with gcc & gc
Plug 'http://github.com/tpope/vim-surround' " surrounding with ysw)
Plug 'https://github.com/ryanoasis/vim-devicons' " dev icons
Plug 'https://github.com/ap/vim-css-color' " css color preview
Plug 'laniusone/kyotonight.vim' " vim theme
Plug 'nvim-lua/plenary.nvim' " fuzzy finder stuff
Plug 'nvim-telescope/telescope.nvim', { 'tag': '0.1.0' } " fuzzy finder stuff
call plug#end()

" color theme
let g:kyotonight_bold = 1
let g:kyotonight_underline = 1
let g:kyotonight_italic = 0
let g:kyotonight_italic_comments = 0
let g:kyotonight_uniform_status_lines = 0
let g:kyotonight_cursor_line_number_background = 0
let g:kyotonight_uniform_diff_background = 0
let g:kyotonight_lualine_bold = 1
colorscheme kyotonight

" Find files using Telescope command-line sugar.
nnoremap <leader>ff <cmd>Telescope find_files<cr>
nnoremap <leader>fg <cmd>Telescope live_grep<cr>
nnoremap <leader>fb <cmd>Telescope buffers<cr>
nnoremap <leader>fh <cmd>Telescope help_tags<cr>

" air-line
let g:airline_powerline_fonts = 1

if !exists('g:airline_symbols')
    let g:airline_symbols = {}
endif

" airline symbols
let g:airline_left_sep = ''
let g:airline_left_alt_sep = ''
let g:airline_right_sep = ''
let g:airline_right_alt_sep = ''
let g:airline_symbols.branch = ''
let g:airline_symbols.readonly = ''
let g:airline_symbols.linenr = ''

" coc
inoremap <expr> <Tab> pumvisible() ? coc#_select_confirm() : "<Tab>"
nnoremap <C-l> :call CocActionAsync('jumpDefinition')<CR>
