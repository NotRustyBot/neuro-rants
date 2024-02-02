import { pageBg } from "./style";
import { saveToken } from "./util";

function AuthCallback() {
    const token = saveToken();

    return (
        <div
            style={{
                backgroundColor: pageBg,
                width: "100vw",
                minHeight: "100vh",
            }}
        >
            <div
                style={{
                    maxWidth: 600,
                    marginRight: "auto",
                    marginLeft: "auto",
                    gap: 30,
                    display: "flex",
                    padding: 10,
                    flexDirection: "column",
                }}
            >
                <p
                    style={{
                        color: "#fff",
                    }}
                >
                    {token ? "Authorised. You can now close this tab." : "Something went wrong"}
                </p>
            </div>
        </div>
    );
}

export default AuthCallback;
