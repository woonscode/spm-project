import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function SecondaryButton() {
    return (
        <Stack direction="row" spacing={2}>
        
        <Button variant="outlined">
            <div class="text">Secondary Button</div>
        </Button>

        </Stack>
);
}
