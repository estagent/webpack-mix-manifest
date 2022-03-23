<?php
if (! function_exists('mix')) {
    /**
     * Get the path to a versioned Mix file.
     *
     * @param string $path
     * @param string|null $manifestDirectory
     * @return string
     *
     * @throws \Exception
     */
    function mix(string $path, ?string $manifestDirectory): string
    {

        $manifest = json_decode(file_get_contents(($manifestDirectory ?: $_SERVER['DOCUMENT_ROOT']) . '/mix-manifest.json'), true);

        $path = "/{$path}";

        if (! array_key_exists($path, $manifest)) {
            throw new \Exception("Unable to locate Mix file: {$path}. Please check your");
        }
        return $manifest[$path];
    }
}
