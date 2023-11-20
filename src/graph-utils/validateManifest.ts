export function validateManifest(manifest: any): string[] {
    let errors: string[] = []
    Object.keys(manifest.trigger).map((k) => {
        let triggers = manifest.trigger[k]

        triggers.map((trigger: any) => {
            if (!trigger.component) {
                errors.push(`${trigger.id} is not connected to a component`)
            }
        })
    })
    return errors
} 