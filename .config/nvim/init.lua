-- ~/.config/nvim/init.lua
-- neovim config file
-- created by : bluecosmo

-- global
vim.g.mapleader = " "

-- lazy
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
    vim.fn.system({
            "git",
            "clone",
            "--filter=blob:none",
            "https://github.com/folke/lazy.nvim.git",
            "--branch=stable", -- latest stable release
            lazypath
    })
end
vim.opt.rtp:prepend(lazypath)

-- installed plugins
local plugins = {
    -- airline
    {"vim-airline/vim-airline"},
    {"vim-airline/vim-airline-themes"},
    -- alpha
    {
        "goolord/alpha-nvim",
        dependencies = {"nvim-tree/nvim-web-devicons"},
        config = function()
            local alpha = require("alpha")
            local dashboard = require("alpha.themes.dashboard")

            dashboard.section.header.val = {
                [[  ██████╗ ██████╗ ███████╗███╗   ███╗ ██████╗ ██████╗ ██╗██╗   ██╗███╗   ███╗ ██████╗███████╗ ]],
                [[ ██╔════╝██╔═══██╗██╔════╝████╗ ████║██╔═══██╗██╔══██╗██║██║   ██║████╗ ████║██╔════╝██╔════╝ ]],
                [[ ██║     ██║   ██║███████╗██╔████╔██║██║   ██║██║  ██║██║██║   ██║██╔████╔██║██║     ███████╗ ]],
                [[ ██║     ██║   ██║╚════██║██║╚██╔╝██║██║   ██║██║  ██║██║██║   ██║██║╚██╔╝██║██║     ╚════██║ ]],
                [[ ╚██████╗╚██████╔╝███████║██║ ╚═╝ ██║╚██████╔╝██████╔╝██║╚██████╔╝██║ ╚═╝ ██║╚██████╗███████║ ]],
                [[  ╚═════╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝╚══════╝ ]],
                [[]],
                [[             • Malware Development • Offensive Development • Payload Development •            ]]
            }

            dashboard.section.buttons.val = {
                dashboard.button("n", "📄 • New File", ":ene <BAR> startinsert <CR>"),
                dashboard.button("o", "📁 • Open File", ":Telescope find_files <CR>"),
                dashboard.button(
                    "v",
                    "🪨 • Obsidian Vault",
                    ":lua require('telescope.builtin').find_files({ cwd = '~/obsidian' })<CR>"
                ),
                dashboard.button("r", "👀 • Recently Used", ":Telescope oldfiles <CR>"),
                dashboard.button("f", "🔎 • Find Text", ":Telescope live_grep <CR>"),
                dashboard.button("e", "🤖 • Edit Config", ":e ~/.dotfiles/.config/nvim/init.lua<CR>"),
                dashboard.button("q", "🙈 • Quit NeoVim", ":qa<CR>")
            }

            local function footer()
                return "• NeoVim •"
            end

            dashboard.section.footer.val = footer()
            alpha.setup(dashboard.config)
        end
    },
    -- bullets
    {"bullets-vim/bullets.vim"},
    -- commentary and surround
    {"tpope/vim-commentary"},
    {"tpope/vim-surround"},
    -- harpoon
    {"ThePrimeagen/harpoon"},
    -- icons and colors
    {"ryanoasis/vim-devicons"},
    {"ap/vim-css-color"},
    -- lsp zero
    {"williamboman/mason.nvim"},
    {"williamboman/mason-lspconfig.nvim"},
    {
        "VonHeikemen/lsp-zero.nvim",
        branch = "v3.x",
        lazy = true,
        config = false
    },
    {
        "neovim/nvim-lspconfig",
        dependencies = {
            {"hrsh7th/cmp-nvim-lsp"}
        }
    },
    {
        "hrsh7th/nvim-cmp",
        dependencies = {
            {"L3MON4D3/LuaSnip"}
        }
    },
    -- markdown table
    {"tyrossel/MarkdownTable.nvim"},
    -- notify
    {"rcarriga/nvim-notify"},
    -- obsidian
    {
        "epwalsh/obsidian.nvim",
        version = "*",
        lazy = true,
        ft = "markdown",
        dependencies = {
            "nvim-lua/plenary.nvim"
        },
        opts = {
            workspaces = {
                {
                    name = "vault",
                    path = "~/obsidian"
                }
            },
            templates = {
                folder = "04 - templates",
                date_format = "%Y-%m-%d"
            },
            disable_frontmatter = true,
            attachments = {
                img_folder = "05 - assets",
                img_text_func = function(client, path)
                    path = client:vault_relative_path(path) or path
                    return string.format("![[%s]]", path.name)
                end
            }
        }
    },
    -- telescope
    {
        "nvim-telescope/telescope.nvim",
        tag = "0.1.5",
        dependencies = {"nvim-lua/plenary.nvim"}
    },
    -- tmux navigator
    {"christoomey/vim-tmux-navigator"},
    -- treesitter
    {"nvim-treesitter/nvim-treesitter", build = ":TSUpdate"},
    {"atelierbram/Base2Tone-nvim"}
}

-- plugin options
local opts = {}
require("lazy").setup(plugins, opts)

-- airline
if vim.g.airline_symbols == nil then
    vim.g.airline_symbols = {}
end
vim.g.airline_left_sep = ""
vim.g.airline_left_alt_sep = ""
vim.g.airline_right_sep = ""
vim.g.airline_right_alt_sep = ""
vim.g.airline_symbols.branch = ""
vim.g.airline_symbols.readonly = ""
vim.g.airline_symbols.linenr = ""
vim.g.airline_theme = "lucius"
-- vim.g.airline_theme = 'deus'

-- bullets
vim.g.bullets_enabled_file_types = {
  'markdown',
  'text',
  'gitcommit',
  'scratch'
}

-- file type text width
vim.opt.textwidth = 80
vim.api.nvim_create_augroup('filetype_specific', { clear = true })
vim.api.nvim_create_autocmd('FileType', {
    pattern = {
        'markdown',
        'text'
    },
    group = 'filetype_specific',
    callback = function()
        vim.opt_local.textwidth = 60
    end,
})
vim.api.nvim_create_autocmd('FileType', {
    pattern = {
        'python',
        'c',
        'lua',
        'javascript',
        'html'
    },
    group = 'filetype_specific',
    callback = function()
        vim.opt_local.textwidth = 80
    end,
})

-- fold text
function fold_text()
    local current_pos = vim.fn.getpos(".")
    vim.cmd("normal! m`")
    vim.cmd("%!fold -s -w60")
    vim.fn.setpos(".", current_pos)
end
vim.api.nvim_set_keymap(
    "n", 
    "<Leader>f", 
    ":lua fold_text()<CR>", 
    {noremap = true, silent = true}
)

-- harpoon
local mark = require("harpoon.mark")
local ui = require("harpoon.ui")
vim.keymap.set("n", "<leader>a", mark.add_file)
vim.keymap.set("n", "<leader>m", ui.toggle_quick_menu)
vim.keymap.set("n", "<leader>1", function() ui.nav_file(1) end)
vim.keymap.set("n", "<leader>2", function() ui.nav_file(2) end)
vim.keymap.set("n", "<leader>3", function() ui.nav_file(3) end)
vim.keymap.set("n", "<leader>4", function() ui.nav_file(4) end)
vim.keymap.set("n", "<leader>5", function() ui.nav_file(5) end)
vim.keymap.set("n", "<leader>6", function() ui.nav_file(6) end)
vim.keymap.set("n", "<leader>7", function() ui.nav_file(7) end)
vim.keymap.set("n", "<leader>8", function() ui.nav_file(8) end)
vim.keymap.set("n", "<leader>9", function() ui.nav_file(9) end)
vim.keymap.set("n", "<leader>0", function() ui.nav_file(0) end)

-- keymaps
vim.keymap.set("i", "<C-c>", "<Esc>")
vim.keymap.set("n", "<leader>s", [[:%s/\<<C-r><C-w>\>/<C-r><C-w>/gI<Left><Left><Left>]])
vim.keymap.set("n", "<leader>x", "<cmd>!chmod +x %<CR>", {silent = true})
vim.keymap.set("v", "J", ":m '>+1<CR>gv=gv")
vim.keymap.set("v", "K", ":m '<-2<CR>gv=gv")
vim.api.nvim_set_keymap("n", "<Leader>q", ":Alpha<CR>", {noremap = true, silent = true})
vim.api.nvim_set_keymap("n", "<Leader>l", ":Mason<CR>", {noremap = true, silent = true})
vim.api.nvim_set_keymap("n", "<Leader>r", ":edit<CR>", {noremap = true, silent = true})
vim.api.nvim_set_keymap("n", "<leader>b", "<C-^>", {noremap = true, silent = true})

-- lsp zero
local lsp_zero = require("lsp-zero")
lsp_zero.on_attach(
    function(client, bufnr)
        lsp_zero.default_keymaps({buffer = bufnr})
    end
)
local cmp = require("cmp")
local cmp_action = require("lsp-zero").cmp_action()
cmp.setup({
    mapping = cmp.mapping.preset.insert({
        ["<CR>"] = cmp.mapping.confirm({select = false}),
        ["<C-p>"] = cmp.mapping.select_prev_item(cmp_select),
        ["<C-n>"] = cmp.mapping.select_next_item(cmp_select),
        ["<Tab>"] = cmp.mapping.confirm({select = true}),
        ["<C-u>"] = cmp.mapping.scroll_docs(-4),
        ["<C-d>"] = cmp.mapping.scroll_docs(4)
    })
})
lsp_zero.on_attach(
    function(client, bufnr)
        local opts = {buffer = bufnr, remap = false}
        vim.keymap.set(
            "n",
            "<leader>gd",
            function() vim.lsp.buf.definition() end,
            opts
        )
        vim.keymap.set(
            "n",
            "K",
            function() vim.lsp.buf.hover() end,
            opts
        )
        vim.keymap.set(
            "n",
            "<leader>vws",
            function() vim.lsp.buf.workspace_symbol() end,
            opts
        )
        vim.keymap.set(
            "n",
            "<leader>vd",
            function() vim.diagnostic.open_float() end,
            opts
        )
        vim.keymap.set(
            "n",
            "[d",
            function() vim.diagnostic.goto_next() end,
            opts
        )
        vim.keymap.set(
            "n",
            "]d",
            function() vim.diagnostic.goto_prev() end,
            opts
        )
        vim.keymap.set(
            "n",
            "<leader>vca",
            function() vim.lsp.buf.code_action() end,
            opts
        )
        vim.keymap.set(
            "n",
            "<leader>vrr",
            function() vim.lsp.buf.references() end,
            opts
        )
        vim.keymap.set(
            "n",
            "<leader>vrn",
            function() vim.lsp.buf.rename() end,
            opts
        )
        vim.keymap.set(
            "i",
            "<C-h>",
            function() vim.lsp.buf.signature_help() end,
            opts
        )
    end
)
vim.g.lsp_zero_api_warnings = 0
lsp_zero.set_preferences({
    suggest_lsp_servers = true,
    sign_icons = {
        error = "E",
        warn = "W",
        hint = "H",
        info = "I"
    }
})
lsp_zero.setup()
require("mason").setup({})
require("mason-lspconfig").setup({
    handlers = {
        lsp_zero.default_setup
    }
})

-- navigation (default centering)
vim.keymap.set("n", "n", "nzzzv")
vim.keymap.set("n", "N", "Nzzzv")
vim.keymap.set("n", "<C-d>", "<C-d>zz")
vim.keymap.set("n", "<C-u>", "<C-u>zz")
vim.api.nvim_set_keymap("n", "<CR>", ":normal! zz<CR>", {noremap = true, silent = true})
vim.api.nvim_set_keymap("i", "<Esc>", "<Esc>:normal! zz<CR>", {noremap = true, silent = true})
vim.api.nvim_set_keymap("v", "<Esc>", "<Esc>:normal! zz<CR>", {noremap = true, silent = true})
vim.api.nvim_set_keymap("n", "gg", "ggzz", {noremap = true, silent = true})
vim.api.nvim_set_keymap("n", "GG", "GGzz", {noremap = true, silent = true})

-- netrw
function ToggleNetrw()
    local bufnr = vim.fn.bufnr("%")
    local bufname = vim.fn.bufname(bufnr)
    local filetype = vim.bo.filetype

    if filetype == "netrw" then
        vim.cmd("bwipeout")
        -- Close the window if it's not the last one
        if vim.fn.winnr("$") > 1 then
            vim.cmd("close")
        end
    else
        vim.cmd("Vexplore")
    end
end
vim.g.netrw_banner = 0
vim.g.netrw_liststyle = 3
vim.g.netrw_browse_split = 4
vim.g.netrw_fastbrowse = 0
vim.g.netrw_altv = 1
vim.g.netrw_winsize = 25
vim.g.netrw_list_hide = "\\(^\\|\\s\\s\\)\\(\\.env\\|\\.secrets\\|\\.git\\)\\($\\|/\\|\\s\\s\\)"
vim.api.nvim_command("augroup ProjectDrawer")
vim.api.nvim_command("autocmd!")
vim.api.nvim_command("autocmd VimEnter * let g:netrw_banner = 0")
vim.api.nvim_command("augroup END")
-- vim.api.nvim_set_keymap('n', '<C-e>', ':Vexplore<CR>', { silent = true })
vim.api.nvim_set_keymap("n", "<C-e>", ":lua ToggleNetrw()<CR>", {noremap = true, silent = true})

-- notify
vim.notify = require("notify")

-- obsidian
vim.api.nvim_set_keymap("n", "<A-i>", ":ObsidianTemplate<CR>", {noremap = true, silent = true})
vim.api.nvim_set_keymap("n", "<leader>op", ":ObsidianPasteImg<CR>", {noremap = true, silent = true})
vim.api.nvim_set_keymap("v", "<leader>ot", ":!column -t -s '|' -o '|'<CR>", {noremap = true, silent = true})

-- telescope
local builtin = require("telescope.builtin")
vim.keymap.set("n", "<C-o>", builtin.find_files, {noremap = true, silent = true})
vim.keymap.set("n", "<C-f>", builtin.live_grep, {noremap = true, silent = true})
vim.keymap.set("n", "<C-e>", vim.cmd.Ex)

-- tmux navigation
function netrw_move_to_right_pane()
    vim.cmd([[wincmd l]])
end
vim.cmd [[
  autocmd FileType netrw nnoremap <buffer> <C-L> :lua netrw_move_to_right_pane()<CR>
]]

-- treesitter
local config = require("nvim-treesitter.configs")
config.setup({
    ensure_installed = {"c", "lua", "vim", "vimdoc", "query"},
    highlight = {
        enable = true,
        additional_vim_regex_highlighting = false
    },
    indent = {enable = true}
})

-- settings
vim.api.nvim_command("set mouse=a")
vim.api.nvim_command("set completeopt-=preview")
vim.api.nvim_command("set encoding=UTF-8")
vim.api.nvim_command("colorscheme habamax")
-- vim.api.nvim_command('colorscheme base2tone_lake_dark')
vim.cmd("hi normal guibg=#0F1C21")
-- vim.cmd('hi normal guibg=#0D0F10')
vim.o.guicursor = "a:block"
vim.opt.guifont = {"Cascadia Code", ":h12"}
vim.opt.nu = true
vim.opt.relativenumber = true
vim.opt.autoindent = true
vim.opt.tabstop = 4
vim.opt.softtabstop = 4
vim.opt.shiftwidth = 4
vim.opt.expandtab = true
vim.opt.smartindent = true
vim.opt.smarttab = true
vim.opt.linebreak = true
vim.opt.wrap = false
vim.opt.swapfile = false
vim.opt.backup = false
vim.opt.undofile = true
vim.opt.hlsearch = false
vim.opt.incsearch = true
vim.opt.termguicolors = true
vim.opt.scrolloff = 8
vim.opt.signcolumn = "yes"
vim.opt.isfname:append("@-@")
vim.opt.updatetime = 50
vim.opt.colorcolumn = "80"
vim.opt.conceallevel = 2
