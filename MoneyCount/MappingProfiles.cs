
using AutoMapper;
using MoneyCount.Entities;
using MoneyCount.Models;
using MoneyCount.Models.Payment;

namespace MoneyCount
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        { 
            CreateMap<Payment, PaymentListViewModel>()
                .ForPath(dest => dest.Category.Name, opt => opt.MapFrom(src => src.Category.Name))
                .ForPath(dest => dest.Category.Icon, opt => opt.MapFrom(src => src.Category.Icon));
            CreateMap<PaymentListViewModel, Payment>()
                 .ForPath(dest => dest.Category.Name, opt => opt.MapFrom(src => src.Category.Name))
                .ForPath(dest => dest.Category.Icon, opt => opt.MapFrom(src => src.Category.Icon));
            CreateMap<Payment, PaymentDetailViewMode>();
            CreateMap<CreatePaymentModel, Payment>()
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.CategoryId));
            CreateMap<PutPaymentModel, Payment>();

            CreateMap<CategoryModel, Category>();
            CreateMap<Category, CategoryModel>();
        }
    }
}
