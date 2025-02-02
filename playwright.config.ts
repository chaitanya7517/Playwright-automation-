import { defineConfig } from '@playwright/test';

export default defineConfig({
    reporter: [
        ['html', {
            outputFolder: 'playwright-report',
            open: 'never' // 👈 Add this to disable automatic opening
        }]
    ]
});