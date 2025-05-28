namespace MoneyCount.Models
{
    public class ResponseHelper
    {
        public static BaseResponseModel CreateResponse(bool status, string message, object? data)
        {
            BaseResponseModel response = new(
                status,
                message,
                data);

            return response;
        }
    }
}
