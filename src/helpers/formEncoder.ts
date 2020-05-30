export default function formEncoder(obj: any) {
    return (new URLSearchParams(obj)).toString();
}
