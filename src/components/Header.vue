<script setup lang="ts"></script>
<template>
    <input type="checkbox" id="menu-open" class="hidden" />
    <header id="header"
        class="flex bg-gray-800 text-gray-100 md:hidden ransition duration-200 ease-in-out rounded-lg fixed z-50 top-4 left-4"
        data-dev-hint="mobile menu bar">
        <label for="menu-open" id="mobile-menu-button"
            class="m-2 p-2 focus:outline-none hover:text-white hover:bg-gray-700 rounded-md">
            <svg id="menu-open-icon" class="h-6 w-6 transition duration-200 ease-in-out" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg id="menu-close-icon" class="h-6 w-6 transition duration-200 ease-in-out" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </label>
    </header>
</template>
<style>
#menu-close-icon {
    display: none;
}

#menu-open:checked~div #sidebar {
    --tw-translate-x: 0;
}

#menu-open:checked~* #menu-open-icon {
    display: none;
}

#menu-open:checked~* #menu-close-icon {
    display: block;
}

#menu-open:checked~#header {
    left: 76%;
}
</style>