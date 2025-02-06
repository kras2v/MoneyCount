
using AutoMapper;
using MoneyCount.Entities;
using MoneyCount.Models;
using MoneyCount.Models.Authentication;
using MoneyCount.Models.Categories;
using MoneyCount.Models.Payment;

namespace MoneyCount
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Transaction, TransactionListViewModel>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category));
            CreateMap<TransactionListViewModel, Transaction>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category));

            CreateMap<Transaction, TransactionDetailViewMode>();
            CreateMap<CreateTransactionModel, Transaction>()
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.CategoryId));
            CreateMap<PutTransactionModel, Transaction>();

            CreateMap<CategoryModel, Category>().ReverseMap();
            CreateMap<CreateCategoryModel, Category>().ReverseMap();

        }
    }
}
