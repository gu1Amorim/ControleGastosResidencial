using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Cryptography;
using System.Text;

namespace ControleGastosAPI.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class ApiKeyAttribute : Attribute, IAsyncActionFilter
    {
        private const string APIKEYNAME = "X-Api-Key";

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // 1. Verifica se a chave veio no Header da requisição
            if (!context.HttpContext.Request.Headers.TryGetValue(APIKEYNAME, out var extractedApiKey))
            {
                context.Result = new ContentResult() { StatusCode = 401, Content = "API Key não fornecida." };
                return;
            }

            // 2. Pega a chave correta que está no appsettings.json
            var appSettings = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
            var apiKey = appSettings.GetValue<string>("ApiKey") ?? "";
            var extractedKeyString = extractedApiKey.ToString();

            // 1. Verifica o comprimento primeiro para evitar exceção no FixedTimeEquals
            if (apiKey.Length != extractedKeyString.Length)
            {
                context.Result = new ContentResult
                {
                    StatusCode = 401,
                    Content = "Acesso não autorizado. API Key inválida."
                };
                return;
            }

            // 2. Convertemos e comparamos com segurança
            var apiKeyBytes = Encoding.UTF8.GetBytes(apiKey);
            var extractedBytes = Encoding.UTF8.GetBytes(extractedKeyString);

            if (!CryptographicOperations.FixedTimeEquals(apiKeyBytes, extractedBytes))
            {
                context.Result = new ContentResult
                {
                    StatusCode = 401,
                    Content = "Acesso não autorizado. API Key inválida."
                };
                return;
            }

            await next();
        }
    }
}