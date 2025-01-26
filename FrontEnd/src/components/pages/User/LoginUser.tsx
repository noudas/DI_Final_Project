import { Input } from "../../generics/Input"
import { Label } from "../../generics/Label"

const LoginUser = () => {
    return (
        <>
        <h3>Login</h3>
        <form>
            <Label text={"Username"} htmlFor={""}/>
            <Input label={"Username"} name={"Username"} value={undefined} onChange={function (name: string, value: any): void {
                    throw new Error("Function not implemented.")
                } }/>
            <Label text={"Password"} htmlFor={""}/>
            <Input label={"Password"} name={"Password"} value={undefined} onChange={function (name: string, value: any): void {
                    throw new Error("Function not implemented.")
                } }/>
        </form>
        </>
    )
}

export default LoginUser