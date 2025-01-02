declare namespace Plaid {
    interface Handler {
        open: () => void;
        exit: () => void;
        destroy?: () => void;
    }
    
    interface CreateConfig {
        token: string;

        //Create function types
        onSuccess: (token:string, metadata:any) => void;
        onExit?: (err:any, metadata:any) => void;
        onEvent?: (eventName:string, metadata:any) => void;
    }

    function create(configObj:CreateConfig) :Handler;
};